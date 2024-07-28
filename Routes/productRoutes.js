const express = require("express");
const router = express.Router();
const { authenticateAccessToken } = require("../middleware/authenticateAccessToken");
const { isAdmin } = require("../middleware/isAdmin");
const Products = require("../models/product");

// Get all products with pagination
router.get("/", async (req, res) => {
    /* Pagination */
    const pages = parseInt(req.query.page) || 1;
    const productItemCount = parseInt(req.query.item_count) || 10;
    const skip = (pages - 1) * productItemCount;
    const totalItems = await Products.countDocuments();
    const totalPages = Math.ceil(totalItems / productItemCount);

    try {
        const products = await Products.find().skip(skip).limit(productItemCount);
        res.json({ products, pages, totalPages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific product by ID
router.get("/product/:id", authenticateAccessToken, async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new product
router.post("/productCreate", authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { title, description, price, gallery, category, currency, stock, itemOptions } = req.body;
        const product = new Products({ title, description, price, gallery, category, currency, stock, itemOptions });
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a product by ID
router.put("/productPut/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { title, description, price, gallery, category, currency, stock, itemOptions } = req.body;
        const updatedProduct = await Products.findByIdAndUpdate(
            req.params.id,
            { title, description, price, gallery, category, currency, stock, itemOptions },
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
router.delete("/productDelete/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const product = await Products.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Product Search
router.get("/search/:searchThem", async (req, res) => {
    try {
        const searchValue = req.params.searchThem;
        const results = await Products.find({
            $or: [
                { title: { $regex: searchValue, $options: "i" } },
                { description: { $regex: searchValue, $options: "i" } },
            ]
        });
        res.json(results);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
