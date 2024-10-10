// Functions for email creation, sending, receiving

//controller to handle the logic for creating an email address
const nodemailer = require("nodemailer");
const EmailAddress = require("../models/emailAddress");
const User = require("../models/userModel");

//controller to create an email address for a user
const createEmailAddress = async (req, res) => {
  const { username, email } = req.body;

  try {
    // // console.log('Route handler: req.user =',  req.user);
    // // const { emailPrefix, domain } = req.body;// we're receiving the email prefix from the request body
    // const userId = req.user.userId; //extract userId from req.user
    const user = await User.findOne({ username });

    //check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //validate if the email belongs to the user's custom domain
    const domain = email.split("@")[1];
    if (domain !== user.domain) {
      return res.status(400).json({
        message: "Email domain does not match the user's custom domain.",
      });
    }

    //add the new email address
    if (!user.emailAddresses.includes(email)) {
      user.emailAddresses.push(email);
      await user.save();
      return res
        .status(200)
        .json({ message: "Email address created succesfully", email });
    } else {
      return res.status(409).json({ message: "Email address already exists." });
    }
    //fetch the user from the database to get the domain
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // const domain = user.domain;

    // if(!emailPrefix || !domain) {
    //     return res.status(400).json({ message: 'Email prefix and domain are required'});
    // }

    // const user = req.user; //we assume the user is authenticated using the authMddleware

    // //cosntruct the full email address using the user's custom domain
    // const domain = user.domain;

    //check if the user already has this email address
    // const emailAddress = `${emailPrefix}@${domain}`; //emailPrefix + custom domain

    // console.log("User:", req.user); // To check if the authenticated user is properly passed in
    // console.log("Email prefix:", emailPrefix); // To check if the request body contains the correct emailPrefix

    // //check if email address already exists

    // const existingEmail = await EmailAddress.findOne({ emailAddress });
    // if (existingEmail) {
    //   return res.status(400).json({ message: "Email Address already exists" });
    // }

    // //create a new email address for the user
    // const newEmailAddress = new EmailAddress({
    //   user: user._id, //link the email address to the user; storing the user's Id; use the user's objectId
    //   emailAddress,
    //   domain, //: user.domain, //store the user's custom domain
    // });
    // //save the email address in the database
    // await newEmailAddress.save();
    // //return the success response
    // res.status(201).json({
    //   message: "Email Address created successully",
    //   emailAddress: newEmailAddress,
    // });
  } catch (error) {
    console.log("Error creating email address", error.message);
    res.status(500).json({ message: "Error creating email address" });
  }
};

const sendMail = async (req, res) => {
  const { fromEmail, toEmail, subject, text } = req.body;

  try {
    // check if the sender's email address belongs to the user

    const email = await EmailAddress.findOne({
      emailAddress: fromEmail,
      user: req.user.userId,
    });
    if (!email) {
      return res.status(400).json({ message: "Invalid sender email address" });
    }

    //Nodemailer transporter configuration ( using a service like Gmail, SMTP, etc.)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, //'your-email@gmail.com',
        pass: process.env.EMAIL_PASS, //'your email password or app password',
      },
    });

    // sending the email
    let info = await transporter.sendMail({
      from: fromEmail, // sender email
      to: toEmail, // receiver email
      subject: subject, // email subject
      text: text, // email body
    });

    res.status(200).json({
      message: "Email sent successfully",
      info,
    });
  } catch (error) {
    console.log("Error sending email: ", error.message);
    res.status(500).json({ message: "Error sending mail" });
  }
};

const receiveEmail = async (req, res) => {
  const { sender, recipient, subject, text } = req.body;

  try {
    //save the email details to the database
    const newEmail = new Email({
      sender,
      recipient,
      subject,
      text,
    });

    await newEmail.save();

    res.status(200).json({
      message: "Email  received successfully",
      email: newEmail,
    });
  } catch (error) {
    console.error("Error receiing email: ", error.message);
    res.status(500).json({ message: "Error  receiving email" });
  }
};

module.exports = {
  createEmailAddress,
  sendMail,
  receiveEmail,
};
