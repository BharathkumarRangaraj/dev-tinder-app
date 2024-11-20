const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
      timestamps: {
        createdAt: "created_at", // Use `created_at` to store the created date
        updatedAt: "updated_at", // and `updated_at` to store the last updated date
      },
      minlength: 4,
      maxlength: 45,
    },
    lastname: {
      type: String,
      required: true,
      unique: true,
      timestamps: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      //index:true
      minLength: 4,
      maxLength: 45,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not defined in db`,
      },
    },
    age: {
      type: Number,
      min: 18,
    },

    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.methods.getJwt = async function () {
  const users = this;
  const token = await jwt.sign({ _id: users._id }, "tinderdev@123", {
    expiresIn: "7d",
  });
  return token;
};

UserSchema.methods.validatePassword = async function (passwordbyuser) {
  const users = this;
  const passwordHash = users.password;
  const isPasswordValid = await bcrypt.compare(passwordbyuser, passwordHash);
  return isPasswordValid;
};

//to make the firstName and Lastname search first
UserSchema.index({ firstName: 1, lastname: 1 });
module.exports = mongoose.model("User", UserSchema);
