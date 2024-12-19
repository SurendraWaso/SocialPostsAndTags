const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');

// Middleware to authenticate users
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.', error });
  }
};

module.exports = authMiddleware;
