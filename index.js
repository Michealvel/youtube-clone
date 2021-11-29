const connectDB = require("./startup/db");
const express = require("express");
const app = express();
const products = require("./routes/products");
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use("/api/products", products);



app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
