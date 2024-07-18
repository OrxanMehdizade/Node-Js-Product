const express=require("express");
const router=express.Router();
const {authenticateAccessToken}=require("../middleware/authenticateAccessToken");
const {isAdmin} = require("../middleware/isAdmin");
const Products=require("../models/product");

// Get all products
router.get("/", async (req,res)=>{
    try{
        const products= await Products.find();
        res.json(products);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});


// Get a specific product by ID
router.get("/product/:id",authenticateAccessToken,async (req,res)=>{
    try{
        const product= await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

// Create a new product
router.post("/productCreate",authenticateAccessToken,isAdmin, async (req,res)=>{
    try {
        const { title, description, price, gallery, category, currency, stock } = req.body;
        const product = new Products({ title, description, price, gallery, category, currency, stock });
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a product by ID
router.put("/productPut/:id",authenticateAccessToken,isAdmin,async (req,res)=>{


    try {
        const { title, description, price, gallery, category, currency, stock } = req.body;

        const updatedProduct = await Products.findByIdAndUpdate(
            req.params.id,
            { title, description, price, gallery, category, currency, stock },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a product by ID
router.delete("/productDelete/:id",authenticateAccessToken,isAdmin, async (req,res)=>{
    try {
        const product = Products.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports=router;