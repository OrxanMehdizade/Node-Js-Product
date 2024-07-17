const express=require("express");
const router=express.Router();
const Order=require("../models/orderItem");
const Products=require("../models/product");
const {authenticateAccessToken}=require("../middleware/authenticateAccessToken");
const {isAdmin} = require("../middleware/isAdmin");

router.get("/",authenticateAccessToken, async (req,res)=>{
    try{
        const order= await Order.find({owner:req.user}).populate("products");
        res.json(order);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get("/Order/:id",authenticateAccessToken,isAdmin,async (req,res)=>{
    try{
        const neworderItem= await Order.findById(req.params.id)
            .populate("products")
            .populate("owner","userName email");
        res.json(neworderItem);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});


router.post('/orderCreate', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { user, products } = req.body;
        let totalPrice = 0;
        for (let item of products) {
            const product = await Products.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            totalPrice += product.price * item.quantity;
        }

        const order = new Order({
            user,
            products,
            totalPrice,
        });

        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



router.put('/orderPut/:id', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { user, products } = req.body;
        
        let totalPrice = 0;
        for (let item of products) {
            const product = await Products.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            totalPrice += product.price * item.quantity;
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                user,
                products,
                totalPrice,
            },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/orderDelete/:id",authenticateAccessToken,isAdmin, async (req,res)=>{
    try {
        const orderItem = orderItems.findByIdAndDelete(req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'Product tapilmadi' });
        }

        res.json(orderItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports=router;