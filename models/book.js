const mongoose = require("mongoose");
//Book Model through mongoose package
const Schema = mongoose.Schema;
//Defining Schema here
const bookSchema = new Schema({
  name: String,
  genre: String,
  authorId: String,
});
module.exports = mongoose.model("Book", bookSchema);
