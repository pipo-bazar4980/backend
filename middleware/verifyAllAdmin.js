const ErrorResponse = require("../utils/errorResponse");

exports.verifyAllAdmin = async (req, res, next) => {
   if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      next();
   }
   else {
      return next(new ErrorResponse("Not authorized to access this route", 401));
   }
}
