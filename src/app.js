const express=require('express');
const app=express();
app.use("/test",(req,res)=>{
    res.send('its test')
});
app.use((req,res)=>{
    res.send('its home')
})
app.use("/hey",(req,res)=>{
    res.send('its hey')
})
app.listen(7777,()=>console.log("port running in 7777"));
