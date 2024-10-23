require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const basketRoutes = require("./Routes/basketRoutes");
const formidable = require("formidable");
const AWS = require("aws-sdk");
const fs = require("fs");
const stream = require("stream");
const PRODUCTDB_URL = process.env.CONNECTION_STRING;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const cluster = require("cluster");
const os = require("os");
//const parsefile = require("./fileparser");
const app = express();
const cpuNum = os.cpus().length;
const port = 5000;
app.use(express.json());
app.use(cors());


if (cluster.isMaster) {
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`worker with pid ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(port, () => {
    console.log(`Server running on ${process.pid} @${port}`);
  });
}


mongoose
  .connect(PRODUCTDB_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas", err));


app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/baskets", basketRoutes);
app.post("/parse", (req, res) => {
  // Set the region and access keys
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });


  // Create a new instance of the S3 class
  const s3 = new AWS.S3();


  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const filePath = files.file[0].filepath;


    // Set the parameters for the file you want to upload
    const params = {
      Bucket: "product-img-e-commerce012",
      Key: files.file[0].originalFilename,
      Body: fs.createReadStream(filePath),
    };


    // Upload the file to S3
    s3.upload(params, (err, data) => {
      const result = err
        ? `Error uploading file: ${err}`
        : `File uploaded successfully. File location: <a href="${data.Location}">${data.Location}</a>`;


      res.send(result);
    });
  });
});
app.get("/upload", (req, res) => {
  res.send(`
      <h2>File Upload With <code>"Node.js"</code></h2>
      <form action="/parse" enctype="multipart/form-data" method="post">
        <div>Select a file:
          <input type="file" name="file" multiple="multiple" />
        </div>
        <input type="submit" value="Upload" />
      </form>
 
    `);
});


// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
