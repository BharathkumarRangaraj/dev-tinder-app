const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
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
        throw new Error("emailnot valid");
      }
    },
  },
  password: {
    type: String,
    required:true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("emailnot valid");
      }
    },
  },
  gender:{
    type:String,
    enum:{
      values:['male','female','other'],
      message:`{VALUE} is not defined in db`
    }

  },
  age: {
    type: Number,
    validate(value) {
      if (!validator.isAlphanumeric(value)) {
        throw new Error("emailnot valid");
      }
    },
  },
  // gender: {
  //   type: String,
  //   validate(value) {
  //     if (["male", "female"].includes(value)) {
  //       throw new Error("gender eeor");
  //     }
  //   },
  // },
  about: {
    type: String,
    default: "hey all this ",
  
  },
},{
  timestamps: true,
});
UserSchema.methods.getJwt=async function(){
  const users=this;
  const token=await jwt.sign({ _id:users._id }, "tinderdev@123",{expiresIn:"7d"});
  return token;
}

UserSchema.methods.validatePassword=async function(passwordbyuser){
  const users =this;
  const passwordHash=users.password;
  const isPasswordValid=await bcrypt.compare(passwordbyuser, passwordHash);
  return isPasswordValid;

}
module.exports = mongoose.model("User", UserSchema);
