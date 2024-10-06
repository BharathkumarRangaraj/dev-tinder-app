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
module.exports={
    validateSignupData
}