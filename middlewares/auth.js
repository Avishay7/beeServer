const jwt = require("jsonwebtoken");

//User authentication
exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
      return res.status(401).json({ err: "You must send token in header" })
    }
    try {
      let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
      req.tokenData = decodeToken;
      next();
    }
    catch (err) {
      return res.status(401).json({ err: "Token invalid or expired" });
    }
  }

  //Admin authentication
  exports.authAdmin = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
      return res.status(401).json({ err: "You must send token in header to this endpoint" })
    }
    try {
      let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
      if (decodeToken.role == "admin") {
        req.tokenData = decodeToken;
        next();
      }
      else {
        return res.status(401).json({ err: "You must be admin in this endpoint" })
      }
    }
    catch (err) {
      return res.status(401).json({ err: "Token invalid or expired" });
    }
  }