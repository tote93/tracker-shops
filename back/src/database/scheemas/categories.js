const mongoose = require("mongoose");

// create an schema
var categoryScheema = new mongoose.Schema({
  name: String,
});

var categoryModel = mongoose.model("categories", categoryScheema);

module.exports = { categoryModel };
