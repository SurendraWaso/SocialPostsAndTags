const User = require('../models/users');
const jwt = require('jsonwebtoken');

/**
 * Creates new user with Name, Username and Password
 * @param {Object} req
 * @param {Object} req  {name, username, password}
 * @param {Object} res 
 * @returns {Object} 400 - Bad request (missing mandatory fields or Username already exists).
 * @returns {Object} 500 - Internal server error.
 * @returns {Object} 200 - Success response after saving the post
 */
let signupNewUser =  async (req, res) => {
    try {
      const { name, username, password } = req.body;
  
      if (!name || !username || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Username already exists.' });
  
      const user = new User({ name, username, password });
      await user.save();
  
      res.status(200).json({ message: 'User registered successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error.', error });
    }
  }


  /**
 * Login user if username and password is valid
 * @param {Object} req
 * @param {Object} req  {username, password}
 * @param {Object} res 
 * @returns {Object} 400 - Bad request (Username and password are required or Username already exists or Invalid username or password).
 * @returns {Object} 500 - Internal server error.
 * @returns {Object} 200 - Success response after authentication
 */
let loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }
  
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'Invalid username.' });
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password.' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error.', error });
    }
  }

module.exports  =   {
  signupNewUser,
  loginUser
}