const express=require('express');
const router=express.Router();
const User=require('C:/Users/10685316/Documents/React/inotebookBackend/models/User.js');
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser.js')
const dotenv=require('dotenv');
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;

router.post('/signup',
            body('email').isEmail(),
            body('password').isLength({ min: 5 }),
            async (req,res)=>{
                try {
                    const errors=validationResult(req);
                    if(!errors.isEmpty()){
                        return res.status(400).json({errors : errors.array()});
                    }
                    const user=await User.findOne({email : req.body.email});
                    if(user){
                        return res.status(400).json({error : "A user already exists with same email"});
                    }


                    let salt = await bcrypt.genSalt(10);
                    let hash = await bcrypt.hash(req.body.password,salt);

                    const newuser = await User.create({
                        name : req.body.name,
                        email : req.body.email,
                        password : hash
                    });
                    
                    const data={
                        user:{
                            id : newuser.id
                        }
                    };
                    const token=jwt.sign(data,JWT_SECRET);


                    return res.json({authtoken : token});
                } catch (error) {
                    return res.status(500).send("Internal Server error");
                }

});

router.post('/login',
            body('email').isEmail(),
            body('password').exists(),
            async (req,res) =>{
                try {
                    const errors=validationResult(req);
                    if(!errors.isEmpty()){
                        return res.status(400).json({errors : "Please enter valid credentials"});
                    }
                    const user=await User.findOne({email : req.body.email});
                    if(!user){
                        return res.status(400).json({errors : "Please enter valid credentials"});
                    }
                    
                    const validPassword=await bcrypt.compare(req.body.password,user.password);
                    if(!validPassword){
                        return res.status(400).json({errors : "Please enter valid credentials"});
                    }
                    const data={
                        user : {
                            id : user.id
                        }
                    };
                    const token=jwt.sign(data,JWT_SECRET);
                    return res.json({authtoken : token,sucess:true});
                } catch (error) {
                    console.log(error);
                    return res.status(500).send("Internal server error");
                }
            });


router.post('/getuser',fetchuser,async (req,res)=>{
    try {
        const userId=req.user.id;
        const user=await User.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

module.exports =router;