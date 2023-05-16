const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  if (token) {
    tok = token.split(".")[1];
    tok = JSON.parse(atob(tok));
    tok = new Date(tok.exp * 1000);
    const now = new Date();
    if (now - tok >= 0)
      return res.status(405).json("expired token plz refresh ");
    else {
      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) return res.status(403).json("invalid token");
        req.user = user;
        next();
      });
    }
  } else {
    return res.status(403).json("you need authorization");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
