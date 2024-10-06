const mongoose=require('mongoose');
const validator=require('validator')

const UserSchema=new mongoose.Schema({
    firstName:{

        type:String,
        required:true,
        unique:true,
        
  
    },
    lastname:{
        type:String,
        required:true,
        unique:true,
        timestamps: true 
   
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('emailnot valid')
            }
        }
 
    },
    password:{
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('emailnot valid')
            }
        }
    },
    age:{
        type:Number,
        validate(value){
            if(!validator.isAlphanumeric(value)){
                throw new Error('emailnot valid')
            }
        }

    },
    gender:{
        type:String,
        validate(value){
            if(['male','female'].includes(value)){
                throw new Error('gender eeor')
            }
        }
    },
    about:{
        type:String,
        default:'hey all this ',
        timestamps: true 
    },
   

   
    
}
)
module.exports=mongoose.model("User",UserSchema) 