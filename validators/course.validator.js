const { body } = require('express-validator');

const courseValidator = [
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('description').trim().notEmpty().withMessage('Course description is required'),
  body('category').isIn(['Kids English', 'Junior English', 'SSC English Preparation', 'HSC English Preparation', 'Spoken English']).withMessage('Category must be one of the pre-defined options'),
  body('price').isNumeric().withMessage('Price must be a number')
];

module.exports = {
  courseValidator
};
