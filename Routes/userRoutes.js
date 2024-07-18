const express=require("express");
const router=express.Router();
const {authenticateAccessToken}=require("../middleware/authenticateAccessToken");
const {isAdmin} = require("../middleware/isAdmin");
const User=require("../models/user");


// Get all users
router.get("/",authenticateAccessToken,isAdmin, async (req,res)=>{
    try{
        const users= await User.find();
        res.json(users);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});


// Get user by ID
router.get("/user/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new user
router.post("/userCreate",authenticateAccessToken,isAdmin, async (req,res)=>{
    try{

        const {userName,email,isAdmin,passwordHash}=req.body;
        const user= new User({userName,email,isAdmin,passwordHash});
        const newUser = await user.save();
        res.status(201).json(newUser);
    }catch(err){
        res.status(400).json({message:err.message});
    }
});

// Update user by ID
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

// Delete user by ID
router.delete("/userDelete/:id",authenticateAccessToken,isAdmin, async (req,res)=>{
    try {
        const user = User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports=router;