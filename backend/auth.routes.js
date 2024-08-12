const express=require("express");
const httpStatus = require("http-status");
const { UserModel, Roles } = require("./User.model");
const JWTService = require("./jwt.service")

const router=express.Router();

router.route("/register")
.post(async(req,res)=>{
    const {name,email,role,password}=req.body;

if(!name || !email || !role || !password){
    res.status(httpStatus.BAD_REQUEST).send({

        message:"All fields are required"
    })
}

//check if role is present or not
if(!Object.keys(Roles).includes(role.toLowerCase())){
    return  res.status(httpStatus.BAD_REQUEST).send({
         message:'Please Choose Valid role'
     }) 
 }

const chk_user= await UserModel.findOne({email:email.toLowerCase()});
if(chk_user){
    res.status(httpStatus.BAD_REQUEST).send({
        message:"User already exists"
    })
}


//data save
await UserModel.create({
    name,
    email:email.toLowerCase(),
    role:Roles[role],
    password
})


    res.send({
        msg: "Register Successful"
    });
})

router.route("/login")
.post(async(req,res)=>{
    const {email,password}=req.body;

if(!email || !password){
    res.status(httpStatus.BAD_REQUEST).send({

        message:"All fields are required"
    })
}

const chk_user= await UserModel.findOne({email:email.toLowerCase()});
if(!chk_user){
    res.status(httpStatus.BAD_REQUEST).send({
        message:"Account not exist"
    })
}

//Password match karke dekhenge
const isMatch=await chk_user.matchPassword(password);
if(!isMatch){
    res.status(httpStatus.BAD_REQUEST).send({
        message:"Invalid credentials"
    })
}

        // token save
        const token =JWTService.generateToken(chk_user._id,chk_user.role)


        return  res.send({
            msg:"Login Successfully",
            token
        })
    })


module.exports=router;