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

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('cannot send request to yourself');
    }
})
connectionRequestSchema.index({fromUserId:1,toUserId:1});
module.exports=mongoose.model('connectionRequest',connectionRequestSchema);