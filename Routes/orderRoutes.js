const express=require("express");
const router=express.Router();
const orderItems=require("../models/orderItem");
const Products=require("../models/product");
const {authenticateAccessToken}=require("../middleware/authenticateAccessToken");
const isAdmin = require("../middleware/isAdmin");

router.get("/", async (req,res)=>{
    try{
        const orderItem= await orderItems.find();
        res.json(orderItem);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get("/Order/:id",authenticateAccessToken,async (req,res)=>{
    try{
        const neworderItem= await orderItems.findById(req.params.id);
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