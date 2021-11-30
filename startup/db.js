const mongoose = require("mongoose");
const config = require("config");

function connectDB() {
  console.log("DB", config.get("mongoURI"));
  mongoose
    .connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => {
      console.log(`Could not connect to Mongo. ERROR: ${err}`);
      process.exit(1);
    });
}

module.exports = connectDB;
