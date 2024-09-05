const jwt = require('jsonwebtoken');

const sendToken = (id, statusCode, res) => {
  
  // Create a JWT token
  const token = jwt.sign({ id:id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };


  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    // user,
    token,
  });
};

module.exports = sendToken;
