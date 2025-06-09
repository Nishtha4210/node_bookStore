const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Book = require("../model/book");
const fs = require('fs');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

// Home Page
router.get("/", async (req, res) => {
  const book = await Book.find().sort({ _id: -1 });
  res.render("index", { book });
});

// Add Book Form
router.get("/add", (req, res) => {
  res.render("add");
});



router.post("/add", upload.single("image"), async (req, res) => {
  const { name, releaseDate, type, description, price, rating, review, author } =
    req.body;
  const image = req.file.filename;
  const genre = Array.isArray(req.body.genre)
    ? req.body.genre.join(", ")
    : req.body.genre;

  const book = new Book({
    name,
    releaseDate,
    image,
    genre,
    description,
    price,
    rating,
    review,
    author,
  });

  await book.save();
  res.redirect("/");
});

router.post('/delete/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    const imagePath = path.join(__dirname, '..', 'uploads', book.image);
    
    // Delete file from uploads
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    await Book.findByIdAndDelete(req.params.id);
  }
  res.redirect('/');
});


// book Detail Page
router.get("/book/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("detail", { book });
});

module.exports = router;
