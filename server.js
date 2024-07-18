require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const basketRoutes = require("./Routes/basketRoutes");
const PRODUCTDB_URL = process.env.CONNECTION_STRING;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(PRODUCTDB_URL)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas", err));

    
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/baskets", basketRoutes);


port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


/*
CONNECTION_STRING=mongodb+srv://mehdizadeorxan2000:WQaV9mNgEJxibxF0@todo.vbhj7ed.mongodb.net/?retryWrites=true&w=majority&appName=Todo
ACCESS_TOKEN_SECRET=86990f24d9fcd37079aa218014a79481e78da327ef7f460f21ca9f61f122f7f0a35a69dbb5ad5333b1e6b9b577ebbf85d2c54237bc6a9abcd1d8544827d021ee
REFRESH_TOKEN_SECRET=a718babe06d36ef4486a347a7212d3c1bb494b15e4731c730198b39a454cce1c98fd22ff9af2673d50cc03d88a2864e6645cf752fa94b5d427e36b290a13a102
*/