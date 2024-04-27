const express = require('express');
const router = express.Router();
const {paymentsController}=require('../controllers/payments')


router.post('/create-payment-intent', paymentsController);

module.exports = router;