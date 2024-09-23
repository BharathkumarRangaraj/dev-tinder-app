const userAuth=(req,res,next)=>{
    const token='abc';
    if(token!=='abc'){
        res.status(401).send('user authunticated failed')
    }else{
        console.log('user sucess');
        
       next()
    }
}

const adminAuth=(req,res,next)=>{
    const token='abc';
    if(token!=='abc'){
        res.status(401).send('admin authunticated failed')
    }else{
        console.log('admin sucess');
       next();
    }
}

module.exports={
    userAuth,
    adminAuth
}