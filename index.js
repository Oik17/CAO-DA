const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const userRoute = require('./routes/userRoute');
const socketIO = require('socket.io');
const sellerRoute=require('./routes/sellerRoute')
const paymentRoute=require('./routes/paymentRoute')
const bodyParser = require('body-parser');
const axios = require('axios');


const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = socketIO(server);
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
mongoose.connect(process.env.DBURI);
const stripe = require('stripe')(process.env.STRIPEAPI_SECRET_KEY);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (req, res) => {
  const stripePublishableKey = process.env.STRIPEAPI_KEY;
  res.render('stripe', { stripePublishableKey });
});

app.get("/ping", (req, res) => {
  res.send("pong");
});
app.use("/user", userRoute);
app.use("/seller",sellerRoute);
app.use('/payments', paymentRoute);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('chatMessage', (message) => {
    console.log('Received message:', message);
    io.emit('chatMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js'));
});



app.get('/fetchImage', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://maptiles.p.rapidapi.com/es/map/v1/3/4/2.png',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
    }
  };

  try {
    const response = await axios.request(options);
    res.set('Content-Type', 'image/png'); 
    res.send(response.data); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'); 
  }
});


server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});