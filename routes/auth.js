//this file will define the routes  related to authentication

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

// @route POST / api/auth/register
//  @desc Register a new  user
router.post("/register", registerUser);

// @route POST / api/auth/login
//  @desc login a new  user
router.post("/login", loginUser);

module.exports = router;
