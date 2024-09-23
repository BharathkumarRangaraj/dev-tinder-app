const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Bharath:Bhar%40123@nodecluster.bo08d.mongodb.net/"
  );
};
module.exports = {
  connectDB,
};
