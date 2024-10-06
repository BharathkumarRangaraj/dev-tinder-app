const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    firstName:{

        type:String,
        required:true,
        unique:true
  
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
        lowercase:true
 
    },
    password:{
        type:String
    },
    age:{
        type:Number
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