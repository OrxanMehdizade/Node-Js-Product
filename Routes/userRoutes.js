const express=require("express");
const router=express.Router();
const User=require("../models/user");
const {authenticateAccessToken}=require("../middleware/authenticateAccessToken");
const {isAdmin} = require("../middleware/isAdmin");

router.get("/",authenticateAccessToken,isAdmin, async (req,res)=>{
    try{
        const User= await User.find();
        res.json(User);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get("/User/:id",authenticateAccessToken,isAdmin, async (req,res)=>{
    try{
        const newUser= await User.findById(req.params.id);
        res.json(newUser);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});


router.post("/userCreate",authenticateAccessToken,isAdmin, async (req,res)=>{
    try{

        const {userName,email,isAdmin,passwordHash}=req.body;
        const user= new User({userName,email,isAdmin,passwordHash});
        const newUser = await user.save();
        res.json(newUser);

    }catch(err){
        res.status(400).json({message:err.message});
    }
});


router.put("/userPut/:id",authenticateAccessToken,isAdmin,async (req,res)=>{


    try {
        const passwordHash=await bcrypt.hash(password,10);
        const upUser= await User.findByIdAndUpdate(req.params.id,{
            userName:req.body.userName,
            email:req.body.email,
            passwordHash:passwordHash,
        },{new:true,runValidators:true});
        
        if(!upUser)
            return res.status(404).json({message: "User Not Found"})
        
        res.status(200).json(upUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete("/userDelete/:id",authenticateAccessToken,isAdmin, async (req,res)=>{
    try {
        const user = User.findByIdAndDelete(req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'User tapilmadi' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports=router;