const mongoose = require("mongoose");
//Book Model through mongoose package
const Schema = mongoose.Schema;
//Defining Schema here
const authorSchema = new Schema({
  name: String,
  age: Number,
});
module.exports = mongoose.model("Author", authorSchema);
