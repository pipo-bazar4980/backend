const ErrorResponse = require("../utils/errorResponse");

exports.verifySuperAdmin= async (req, res, next)=>{
   if(req.user.role==='superadmin'){
      next();
      console.log("Role",req.user.role)
   }
   else {
      return next(new ErrorResponse("Not authorized to access this route", 401));
   }
}
