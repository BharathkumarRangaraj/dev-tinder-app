const express=require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../modal/connectionRequest');
const userRouter=express.Router();

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId","firstName lastname email about")

        res.json({
            message:'data fetched succesfully',
            data:connectionRequest
        })

    }
    catch(err){
        res.status(400).send('ERROR:'+err.message)
    }
})

module.exports=userRouter;