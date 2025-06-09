const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: String,
  releaseDate: Date,
  image: String,
  genre: String, 
  description: String,
  price: String,
  rating: Number,
  review: String,
  author: String
});

module.exports = mongoose.model('Book', bookSchema);
