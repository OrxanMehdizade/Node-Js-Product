const mongoose= require('mongoose');
const Products=require("./product")

const orderSchema= new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required: true},
    products:[
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less than 1"]
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
});

const Order= mongoose.model('Order', orderSchema);

module.exports=Order;