const jwt = require("jsonwebtoken");
const User = require("../modal/user");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("invalid token");
    }
    const decodedtoken = await jwt.verify(token, "tinderdev@123");
    const { _id } = decodedtoken;
    console.log(_id, "idddd");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("invalid token");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
};

module.exports = {
  userAuth,
};
