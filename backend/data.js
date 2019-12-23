const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    name: {
        firstName: String,
        lastName: String
    },
    gender: String,
    age: Number,
    address: String
  }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("customer", DataSchema);