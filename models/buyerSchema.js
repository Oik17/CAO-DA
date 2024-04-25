const mongoose = require("mongoose");


const buyerSchema = new mongoose.Schema({
  itemsBought: [{type: String}],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" ,required: true},
  
});

module.exports = mongoose.model("buyer", buyerSchema);