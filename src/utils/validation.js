const validation = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastname, email, password } = req.body;
  let errors = [];

  if (!firstName || !lastname) {
    errors.push("Name is not valid");
  }
  if (!validation.isEmail(email)) {
    errors.push("Email is not valid");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors.length > 0 ? errors : null;
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastname",
    "email",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
};
