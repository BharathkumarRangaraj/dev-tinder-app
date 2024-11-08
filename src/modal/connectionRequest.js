const { default: mongoose } = require("mongoose");

//define the connection request between two users(sender,reciver,status)
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:['interested','ignored','accepted','rejected'],
            message:`{VALUE} is not defined in db`
        }
    }
});


module.exports=mongoose.model('connectionRequest',connectionRequestSchema);