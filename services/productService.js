const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const { uploadMixOfImages}  = require('../middlewares/uploadImageMiddleware');
const Product = require("../models/productModel");
const factory = require('./handlersFactory')

exports.uploadProductImages = uploadMixOfImages([
    {
      name: 'imageCover',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5,
    },
  ]);
  

exports.resizeProductImage = asyncHandler(async(req,res,next)=>{

    // 1- Image Processing for imageCover 
    if(req.files.imageCover){
        const imageCoverFileName =`product-${uuidv4()}-${Date.now()}-cover.jpeg`

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000,1333)
            .toFormat('jpeg')
            .jpeg({quality:95})
            .toFile(`upload/products/${imageCoverFileName}`)

            // Save image into our db 
            req.body.imageCover = imageCoverFileName

    }
    // 2- image processing for images
    if (req.files.images){
        req.body.images = []
        await Promise.all(
            req.files.images.map(async(img,index)=>{
                const imageName =`product-${uuidv4()}-${Date.now()}-${index +  1}.jpeg`

                await sharp(img.buffer)
                    .resize(2000,1333)
                    .toFormat('jpeg')
                    .jpeg({quality:95})
                    .toFile(`upload/products/${imageName}`)

                    // Save image into our db
                    req.body.images.push(imageName)
            })
        )

        next()
    }
})
//  @desc       Get list of Products
//  @route      GET /api/v1/products
//  @access     Public
exports.getProducts = factory.getAll(Product,'Product')

//  @desc       Get specific Product by id
//  @route      GET /api/v1/products/:id
//  @access     Public
exports.getProduct = factory.getOne(Product)

//  @desc       Create Product
//  @route      POST  /api/v1/products
//  @access     Private
exports.createProduct = factory.createOne(Product)

// @desc        Update product
// @route       PUT  /api/v1/products/:id
// @access      Private
exports.updateProduct = factory.updateOne(Product)

// @desc        Delete product
// @route       DELETE  /api/v1/products/:id
// @access      Private

exports.deleteProduct = factory.deleteOne(Product)

