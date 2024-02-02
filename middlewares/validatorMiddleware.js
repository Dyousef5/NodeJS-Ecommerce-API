const { validationResult } = require("express-validator");
// @desc Find the validation errors in this request and wraps them is an object with handy functions
const validatorMiddleware = (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  next()
};

module.exports = validatorMiddleware