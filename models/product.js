const mongoose = require("mongoose");

const productSchema= new mongoose.Schema({
    title: {type:String, required:true, maxlength:[50,"Title cannot be more than 50 characters"]},
    description: {type:String, required:true, unique:true, maxlength:[200,"Description cannot be more than 200 characters"]},
    price: {type:Number, required:true},
    gallery:{type:[String], required:true},
    category:{type:String, required:true, enum:["Texnologiya","Elektronika"]},
    currency:{type:String, enum:["$", "₼", "€"], default:"₼"},
    stock:{type:Number, required:true},
    itemOptions: [{
        size: { type: String, enum: ["S", "M", "L", "XL", "XXL"], required: true },
        color: { type:[String], required: true },
        quantity: { type: Number, required: true }
    }]

},{timestamps:true});

const Product= mongoose.model("Product", productSchema);

module.exports=Product;