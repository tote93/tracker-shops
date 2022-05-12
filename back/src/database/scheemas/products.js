const mongoose = require("mongoose");

// create an schema
var productScheema = new mongoose.Schema({
  title: String,
  link: String,
  price: Number,
  currency: String,
  unitPrice: Number,
  img: String,
  features: Array,
  priceHistory: Array,
  createdAt: Date,
  updatedAt: Date,
});

var ProductModel = mongoose.model("products", productScheema);

module.exports = { ProductModel };
