const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const bcrypt=require('bcryptjs');
const { Roles } =require("./constants")

const UserSchema=new Schema({
    
        name:String,
        email:{
            type:String,
            trim:true,
            lower:true,
            unique:true
        },
        password:String,
        role:{
            type:String,
            default:Roles.user,
            enum:Object.values(Roles)
        }
});

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
});

UserSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}


module.exports = {
  UserModel: mongoose.model("User", UserSchema),
  Roles
};
