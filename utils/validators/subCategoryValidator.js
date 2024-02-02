const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory must have name")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({max:32})
    .withMessage("Too long Subcategory name").custom((val,{req})=>{
      req.body.slug = slugify(val)
      return true
    }),
    check("category").notEmpty().withMessage("Subcategory must be belog to category")
    .isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  body('name').custom((val,{req})=>{
    req.body.slug = slugify(val)
    return true
  }),
  validatorMiddleware,
]
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware,
]
