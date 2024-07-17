const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
    userName: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    passwordHash: {type:String,required:true},
    order:{type:mongoose.Schema.Types.ObjectId,ref:"Order",required: true },
    isAdmin:{type: Boolean, default:false}
});

const User= mongoose.model("User", userSchema);

module.exports=User;