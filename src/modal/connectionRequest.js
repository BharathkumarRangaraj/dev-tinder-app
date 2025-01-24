const { default: mongoose } = require("mongoose");

//define the connection request between two users(sender,reciver,status)
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    status:{
        type:String,
        enum:{
            values:['interested','ignored','accepted','rejected'],
            message:`{VALUE} is not defined in db`
        }
    }
});

connectionRequestSchema.index({fromUserId:1,toUserId:1});
module.exports=mongoose.model('connectionRequest',connectionRequestSchema);