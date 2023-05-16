const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const refreshdb = require("../models/refresh");
const CryptoJS = require("crypto-js");
//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/refresh", async (req, res) => {
  const tok = req.headers.token.split(" ")[1];
  if (!tok) return res.status(400).json("you are not allowed");
  try {
    const tic = await refreshdb.findOne({ token: tok });
    if (!tic) {
      return res.status(403).json("this refresh  token has been stopped ...");
    }
    jwt.verify(tok, process.env.jwt_refresh, (err, user) => {
      if (err) return res.status(403).json("invalid token");
      req.user = user;
    });
    const { iat, ...OTHERS } = req.user;
    const newtoken = jwt.sign(OTHERS, process.env.JWT_SEC, { expiresIn: "3d" });
    res.status(200).json(newtoken);
  } catch (err) {
    res.status(403).json("hellooooo");
  }
});
// in refresh
// headers ---> refresh token and return newAccessToken
router.delete(
  "/deleterefresh/:tok",
  verifyTokenAndAuthorization,
  async (req, res) => {
    const tok = req.params.tok;
    if (!tok) return res.status(400).json("you are not allowed");
    try {
      await refreshdb.findOneAndDelete({ token: tok });
      return res.status(200).json("token deleted successfully");
    } catch (err) {
      return res.status(403).json(err);
    }
  }
);
//delete in url --> refresh token
//delete in header -->accessToken
module.exports = router;
