const Product = require("../models/Product");
const { verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const ObjectId = require("mongoose").Types.ObjectId;
const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    // const product = await Product.aggregate([
    //   { $match: { _id: ObjectId(req.params.id) } },
    //   { $unwind: "$reviews" },
    //   { $sort: { "reviews.date": -1 } },
    //   { $group: { _id: "$_id", reviews: { $push: "$reviews" } } },
    // ]);
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a review
router.post("/:id/reviews", verifyToken, async (req, res) => {
  const product = await Product.findById(req.params.id);
  try {
    if (product.reviews.find((x) => x.username === req.body.username))
      return res.status(400).json("You already submitted a review");
    product.reviews.push(req.body);
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
