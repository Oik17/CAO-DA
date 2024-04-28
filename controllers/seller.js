const { S3Client , PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv=require('dotenv');
const crypto=require('crypto');
const seller=require("../models/sellerSchema")

dotenv.config()

const randomImageName= (bytes=32)=> crypto.randomBytes(bytes).toString('hex');
const bucketName=process.env.BUCKET_NAME
const bucketRegion=process.env.BUCKET_REGION
const accessKey=process.env.ACCESS_KEY
const secretAccesskey=process.env.SECRET_ACCESS_KEY

const s3= new S3Client({
  region: bucketRegion,
  credentials:{
    accessKeyId:accessKey,
    secretAccessKey: secretAccesskey,
  }})

async function uploadSeller(req,res){
  try{
    if (!req.file) {
        return res.status(400).send('Image required to sell.');
    }

    const imageName = randomImageName();
    const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    const imageUrl = `https://s3-${bucketRegion}.amazonaws.com/${params.Bucket}/${params.Key}`;
    const up= await seller.create({
        item: req.body.text,
        imageUrl: imageUrl,
        description: req.body.description,
        price: req.body.price, 
        category: req.body.category,
        createdAt: Date(),

    })
    await up.save();
    console.log(up)
    return res.status(201).json(up);
  } catch(err){
        return res.status(500).json({
          message: "Error making products",
          data: err,
          status: false
        })
  }
}


async function getProduct(req,res){
    try{
      const productAll=await seller.find()
      if(productAll.length==0){
        return res.status(404).json({
          message: "no data found",
          status: false
        })
      }
      else{
        return res.status(201).json(productAll)
      }
    } catch(err){
          console.log(err)
          return res.status(500).json({
            message: "Error fetching products",
            data: err,
            status: false
          })
    }

}

async function getProductByCategory(req, res) {
  try {
      let products;
      if (req.query.category) {
          products = await seller.find({ category: req.query.category });
      } else {
          products = await seller.find();
      }
      if (products.length == 0) {
          return res.status(404).json({
              message: "No products found for the specified category",
              status: false
          });
      } else {
          return res.status(200).json(products);
      }
  } catch (err) {
      console.log(err);
      return res.status(500).json({
          message: "Error fetching products",
          data: err,
          status: false
      });
  }
}


module.exports={
  uploadSeller,
  getProduct,
  getProductByCategory
}