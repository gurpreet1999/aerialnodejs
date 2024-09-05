const jwt = require("jsonwebtoken");
const ErrorHandler = require('../utils/errorHandler');

exports.isAuthenticatedUser = async (req, res, next) => {
  let token;

  // Check if the request is made from Axios
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract the token from the Authorization header
    token = req.headers.authorization.split(' ')[1];
  } 


  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
};


exports.authorizeRoles = async(...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};