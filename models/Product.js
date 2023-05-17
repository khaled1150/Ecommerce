const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  username: { type: String },
  rating: { type: Number },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    reviews: [ReviewSchema],
    sizes: { type: Array },
    colors: { type: Array },
    price: { type: Number, required: true },
    rating: { type: Number, default: 5 },
    countInStock: { type: Number, default: 3 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
