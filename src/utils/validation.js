const validator = require('validator');

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body || {};

  if (!firstName || !lastName) {
    throw new Error('First name and last name are required');
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error('Valid email is required');
  } else if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
};

const validateEditProfileData = (req) => {
  const allowedFields = ['firstName', 'lastName', 'age', 'photoUrl', 'about', 'skills'];

  const isEditAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field));
  return isEditAllowed;
}

module.exports = {
    validateSignupData,
    validateEditProfileData
}