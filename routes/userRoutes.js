// API routes for user management (sign-up, login, etc.)

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const { getUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

//route for user registration
// @route GET /api/user/register

router.post("/register", registerUser);

//route for user login
// @route GET /api/user/login

router.post("/login", loginUser);

//protected route for getting user profile
// @route GET /api/user/profile
router.get("/profile", authMiddleware, getUserProfile); //adding along the aithMiddleware here just to ensure only authenticated users can access it

module.exports = router;
