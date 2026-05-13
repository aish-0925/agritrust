// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

/* ───────── AUTH PROTECT ───────── */

exports.protect = (req, res, next) => {
  let token;

  // Check header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info
      req.user = {
        id: decoded.id || decoded.userId,
        role: decoded.role
      };

      return next();

    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  return res.status(401).json({ message: "No token provided" });
};


/* ───────── ROLE AUTHORIZATION ───────── */

exports.authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user.role}`
      });
    }

    next();
  };
};