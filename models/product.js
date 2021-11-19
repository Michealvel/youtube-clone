const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
  description: { type: String, required: true },
  category: { type: String, required: true, minlength: 5, maxlength: 50 },
  price: { type: Number, required: true },
  dateModified: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;



// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//     name: String,
//     description: String,
//     category: String,
//     price : Number,
//     dateModified: Date,
// })
