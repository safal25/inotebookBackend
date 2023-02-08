var jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;

const fetchuser=(req,res,next)=>{
    try {
        const authtoken=req.header('auth-token');
        if(!authtoken){
            res.status(401).json({error : "Access Denied, Invalid token"});
        }
        const data=jwt.verify(authtoken,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Invalid token");
    }
}

module.exports=fetchuser;