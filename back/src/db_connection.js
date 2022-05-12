const mongoose = require("mongoose");
const nodeENV = process.env.NODE_ENV || "dev";
const connection_url = nodeENV == "dev" ? "mongodb://localhost:27017/shoptracker" : "";
console.log("Trying to connect: ", connection_url);
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

module.exports = { db };
