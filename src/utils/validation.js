const validation = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastname, email, age, password } = req.body;
  if (!firstName || !lastname) {
    throw new Error("name is not valid");
  } else if (!validation.isEmail(email)) {
    throw new Error("email is not valid");
  } else if (!validation.isStrongPassword(password)) {
    throw new Error("password must be strong ");
  }
};
const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastname", "email"];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validateForgotPassword=(req)=>{
  const allowedEditFields = ["password"];
  const isUpdatePassword=Object.keys(req.body.password).every((field)=>allowedEditFields.includes(field))

}
module.exports = {
  validateSignupData,
  validateEditProfileData,
  validateForgotPassword
};
