const express = require('express');
const router = express.Router();
const multer=require('multer');

const storage = multer.memoryStorage()
const uploadImage = multer({ storage: storage })

const {uploadSeller,getProduct, getProductByCategory}=require('../controllers/seller')
const {authenticateToken}= require('../middleware/authenticate')

router.get('/test', (req, res) => {
  res.send("hello");
});


router.post('/createProduct', uploadImage.single("image"), async (req, res) => {
    uploadSeller(req,res);
  });
router.get('/getProducts', async(req,res)=>{
    getProduct(req,res)
})
router.get('/getProductsByCategory', async(req,res)=>{
  getProductByCategory(req,res)
})
// router.get('/getData', authenticateToken,async (req,res)=>{
//   getController(req,res)
// })

module.exports=router;    