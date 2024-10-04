// Define API endpoints

// API routes for email management (create, send, receive)
const express = require("express");
const router = express.Router();
const { createEmailAddress } = require("../controllers/emailController");
const authMiddleware = require("../middlewares/authMiddleware");

// POST to create an email  address for a user
router.post("/create-address", authMiddleware, createEmailAddress);

module.exports = router;
