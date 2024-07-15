const express=require("express");
const router=express.Router();
const Products=require("../models/product");
const {authenticateAccessToken}=require("../middleware/authenticateAccessToken");
const isAdmin = require("../middleware/isAdmin");

router.get("/", async (req,res)=>{
    try{
        const product= await Products.find();
        res.json(product);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get("/Product/:id",authenticateAccessToken,async (req,res)=>{
    try{
        const newProduct= await Products.findById(req.params.id);
        res.json(newProduct);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});


router.post("/productCreate",authenticateAccessToken,isAdmin, async (req,res)=>{
    try{

        const {title,description,price,gallery,category}=req.body;
        const product= new Products({title,description,price,gallery,category});
        const newProduct = await product.save();
        res.json(newProduct);

    }catch(err){
        res.status(400).json({message:err.message});
    }
});


router.put("/productPut/:id",authenticateAccessToken,isAdmin,async (req,res)=>{


    try {
        const upProduct= await Products.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            description:req.body.description,
            price:req.body.price,
            gallery:req.body.gallery,
            category:req.body.category,
        },{new:true,runValidators:true});
        
        if(!upProduct)
            return res.status(404).json({message: "Product Not Found"})
        
        res.status(200).json(upProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete("/productDelete/:id",authenticateAccessToken,isAdmin, async (req,res)=>{
    try {
        const product = Products.findByIdAndDelete(req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'Product tapilmadi' });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports=router;