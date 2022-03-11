const jwt = require('jsonwebtoken')
const User = require('../models/Auth')
const ErrorResponse = require('../utils/errorResponse')


exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")

  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse("User Not Found", 401));
  }
};
