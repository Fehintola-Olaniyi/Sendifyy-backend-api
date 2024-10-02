// API routes for user management (sign-up, login, etc.)

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { getUserProfile } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

//route for user registration
router.post('/register', registerUser);

//route for user login
router.post('/login', loginUser);

// @route GET /api/users/profile
router.get('/profile',  authMiddleware, getUserProfile);


module.exports = router;