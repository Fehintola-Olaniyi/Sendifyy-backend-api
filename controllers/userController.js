// Handles the business logic

// Functions for user - related features(sign - up, domain registration)
//user operations(profile, settings)

const User = require("../models/userModel"); //dont know if this is really needed here tho
const bcrypt = require("bcryptjs");
const req = require("express/lib/request");
const jwt = require("jsonwebtoken");

//register a new user
const registerUser = async (req, res) => {
  try {
    const { username, password, domain } = req.body;

    //validate required fields
    if (!username || !password || !domain) {
      return res
        .status(400)
        .json({ message: "Username, password and domain are required" });
    }
    //basic domain format validation
    const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({ message: "Invalid domain name/format" });
    }

    //check if user with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const newUser = new User({
      username,
      password, //: bcrypt.hashSync(password, 10),
      domain,
    });

    //save user to the database
    await newUser.save();

    const payload = { userId: newUser._id };

    //generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered succesfully",
      user: newUser,
      token: token,
    });
    // //Add logic for registering a user (e.g saving to a db, hashing password)
    // res.send('User Registered');
  } catch (error) {
    console.error("Error registering user: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
//login user
const loginUser = async (req, res) => {
  try {
    const { username, password, domain } = req.body;

    //validate input fields
    if (!username || !password || !domain) {
      return res
        .status(400)
        .json({ message: "Please provide a username, domain, and password." });
    }

    //check if the user exists with the given username and password
    const user = await User.findOne({ username, domain });
    // console.log(user.password);
    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials." });
    }

    //check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    // console.log(password);
    // console.log(user.password);
    // console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid login credentials.." });
    }

    //   generate a JWT token for the user
    const payload = {
      userId: user._id,
      username: user.username,
      domain: user.domain,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //successful login
    return res.status(200).json({
      message: "Login Successful!",
      token,
    });
  } catch (error) {
    console.error("Error during logging in: ", error.message);
    return res.status(500).json({ message: "Server error during logging." });
  }
};

//get user profile
// const getUserProfile = async (req, res) => {
//     try {
//         //req.user should containthe authenticated userID from authMiddleware
//         const user = await User.findById(req.user.userId).select('-password'); //exclude the password

//         if (!user) {
//             return res.status(404).json({ message: 'User not found'});
//         }

//         res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send({ message: 'Server  error' });
//     }

// };

const getUserProfile = (req, res) => {
  res.status(200).json({
    message: "User profile retrieved successfully",
    user: req.user, // Access user info from the request
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
