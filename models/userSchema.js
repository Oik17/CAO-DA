const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
         required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    role: {
        type: String
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],

})

module.exports=mongoose.model("user",userSchema)