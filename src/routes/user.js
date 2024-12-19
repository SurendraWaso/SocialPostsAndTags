const express = require('express');
const router = express.Router();

const usersController  = require('../controllers/userController');

// Signup user
router.post('/signup',usersController.signupNewUser);

// Login user
router.post('/login', usersController.loginUser);

module.exports = router;
