// Handles the business logic

// Functions for user - related features(sign - up, login, domain registration)
//user operations(profile, settings)

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const req = require("express/lib/request");
const jwt = require("jsonwebtoken");
const dns = require("dns");

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
    //basic domain format validation (ensuring the domain isnt empty , it follows a valid format)
    // function to validate domain format
    function isValidDomain(domain) {
      // const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
      const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/;
      return domainRegex.test(domain);
    }
    // check domain format
    if (!isValidDomain(domain)) {
      return res.status(400).json({ message: "Invalid domain format" });
    }

    //will still need to implement advanced domain validation here (verify DNS records for the custom domain at the point of sign-up)
    //need to implement a DNS verification system or send instructions to users on how to validate their ownership of the domain(e.g setting a specific DNS record to prove ownership)
    //ensuring it's a real domain and not a random string

    // DNS and MX Record validation
    // For DNS validation we can use a package like dns (built-in with Node.js) to check if the domainhas the necessary MX Records
    // installation
    // npm install dns

    // Function to check DNS and MX record validation
    // function checkDomainMX(domain, callback) {
    //   dns.resolveMx(domain, (err, addresses) => {
    //     if (err) {
    //       console.error("DNS lookup failed: ", err);
    //       callback(false); // Domain invalid
    //     } else if (!addresses || addresses.length === 0) {
    //       console.log("No MX records found for domain.");
    //       callback(false); // No MX records found
    //     } else {
    //       console.log("Valid MX records found: ", addresses);
    //       callback(true); // Domain valid
    //     }
    //   });
    // }

    // // In your register function, call this before domain registration
    // checkDomainMX(domain, (isValid) => {
    //   if (!isValid) {
    //     return res
    //       .status(400)
    //       .send({ error: "Domain is not valid or does not have MX records." });
    //   }
    //   // Continue with registration logic
    // });

    //check if user with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    //check if user with the same domain already exists
    const existingDomain = await User.findOne({ domain });
    if (existingDomain) {
      return res.status(409).json({ message: "Domain is already taken" });
    }

    //create a new user
    const newUser = new User({
      username,
      password,
      domain, //saving the custom domain provided
    });

    //save user to the database
    await newUser.save();

    //generate JWT token
    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.error("Error registering user: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //validate input fields
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    //check if the user exists with the given username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials." });
    }

    //check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid login credentials." });
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

//torn between the which of the two approaches to use.
// maybe to retrieve the user data from the database (as in the previous version) rather than just using req.user (as in the updated version),
//ill check back later to compare the logic

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
