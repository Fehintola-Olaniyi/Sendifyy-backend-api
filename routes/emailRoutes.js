// Define API endpoints

// API routes for email management (create, send, receive)
const express = require("express");
const {
  createEmailAddress,
  receiveEmail,
} = require("../controllers/emailController");
const { sendMail } = require("../controllers/emailController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// POST to create an email  address for a user
router.post("/create-address", authMiddleware, createEmailAddress);

//route for sending emails
router.post("/send", authMiddleware, sendMail);

//route for receiving emails
router.post("/receive", receiveEmail); //no authMiddleware needed here for webhooks

module.exports = router;
