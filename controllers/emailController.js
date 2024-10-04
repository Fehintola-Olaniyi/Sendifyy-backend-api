// Functions for email creation, sending, receiving

//controller to handle the logic for creating an email address

const EmailAddress = require('../models/emailAddress');
const User = require('../models/userModel');

//controller to create an email address for a user 
const createEmailAddress = async (req, res)  => {
    // const { emailPrefix } = req.body;

    try {
        // console.log('Route handler: req.user =',  req.user);
        const { emailPrefix } = req.body;// we're receiving the email prefix from the request body

        const user = req.user; //we assume the user is authenticated using the authMddleware

        //cosntruct the full email address using the user's custom domain
        const domain = user.domain;

        //check if the user already has this email address
        const emailAddress = `${emailPrefix}@${domain}`;//emailPrefix + custom domain

        console.log('User:', req.user); // To check if the authenticated user is properly passed in
console.log('Email prefix:', emailPrefix); // To check if the request body contains the correct emailPrefix


        const existingEmail = await EmailAddress.findOne({ emailAddress });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email Address already exists' });
        }

        //create a new email address for the user
        const newEmailAddress = new EmailAddress({
            user: user._id,  //link the email address to the user; storing the user's Id
            emailAddress,
            domain: user.domain //store the user's custom domain
        });
        //save the email address in the database
        await newEmailAddress.save();
        //return the success response
        res.status(201).json({
            message: 'Email Address created successully',
            emailAddress:  newEmailAddress
        });
        
    } catch (error) {
        console.log('Error creating email address', error.message);
        res.status(400).json({ message:  'Error creating email address' });
    }
};

module.exports = {
    createEmailAddress
};