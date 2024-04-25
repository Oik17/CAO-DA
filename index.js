const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const userRoute = require('./routes/userRoute');
const socketIO = require('socket.io');
const sellerRoute=require('./routes/sellerRoute')

dotenv.config();
mongoose.connect(process.env.DBURI);

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = socketIO(server);
const path = require('path');


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected');
  // Listen for chat messages from the client
  socket.on('chatMessage', (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all connected clients
    io.emit('chatMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js'));
});


app.use(express.json());
app.use(cors());
app.get("/ping", (req, res) => {
  res.send("pong");
});
app.use("/user", userRoute);
app.use("/seller",sellerRoute);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});