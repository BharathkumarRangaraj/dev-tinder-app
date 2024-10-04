const userAuth=(req,res,next)=>{
    const token='abc';
    if(token!=='abc'){
        res.status(401).send('user authunticated failed')
    }else{
       
        
       next()
    }
}

const adminAuth=(req,res,next)=>{
    const token='abc';
    if(token!=='abc'){
        res.status(401).send('admin authunticated failed')
    }else{
 
       next();
    }
}

module.exports={
    userAuth,
    adminAuth
}