const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");


//Uplode single image 
exports.uploadBrandImage =uploadSingleImage('image')

// Image processing 
exports.resizeImage =asyncHandler(async(req,res,next)=>{
    const filename =`brand-${uuidv4()}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality:95})
        .toFile(`uploads/brands/${filename}`)

    // Save image into our db
    req.body.image = filename

    next()
})
//  @desc       Get list of Brands
//  @route      GET /api/v1/brands
//  @access     Public
exports.getBrands = factory.getAll(Brand)

//  @desc       Get specific Brand by id
//  @route      GET /api/v1/Brands/:id
//  @access     Public
exports.getBrand = factory.getOne(Brand)
//  @desc       Create Brand
//  @route      POST  /api/v1/brands
//  @access     Private
exports.createBrand = factory.createOne(Brand)

// @desc        Update Brand
// @route       PUT  /api/v1/brands/:id
// @access      Private
exports.updateBrand = factory.updateOne(Brand)

// @desc        Delete Brand
// @route       DELETE  /api/v1/brands/:id
// @access      Private

exports.deleteBrand = factory.deleteOne(Brand);
