const stripe = require('stripe')(process.env.STRIPEAPI_SECRET_KEY);



async function paymentsController(req, res){
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount, 
        currency: 'inr',
      });
      //console.log(paymentIntent)
      res.json({ client_secret: paymentIntent.client_secret });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err});
    }
  };

module.exports={
    paymentsController
}