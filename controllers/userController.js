// Handles the business logic


// Functions for user - related features(sign - up, domain registration)

const User = require('../models/userModel') //dont know if this is really needed here tho
const bycrpt = require('bcryptjs');
const req = require('express/lib/request');
const jwt = require('jsonwebtoken')

//register a new user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    //Add logic for registering a user (e.g saving to a db, hashing password)
    res.send('User Registered');
};

//login user    
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    //Add logic for user login (e.g checking password, generating JWT)
    res.send('User logged in');
};



//get user profile
const getUserProfile = async (req, res) => {
    try {
        //req.user should containthe authenticated userID from authMiddleware
        const user = await User.findById(req.user.userId).select('-passowrd'); //exclude the password

        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server  error' });
    }
    
};
module.exports = { 
    registerUser,
    loginUser,
    getUserProfile
 }