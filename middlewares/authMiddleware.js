const jwt = require('jsonwebtoken'); // Import JWT library
const secretKey = process.env.JWT_SECRET_KEY; // JWT secret key

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token'); // Access the token sent in the header

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
