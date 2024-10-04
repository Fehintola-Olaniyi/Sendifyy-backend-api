//email address model for storing the email addresses tied to a user and their custom domain 

//define schema for storing email addresses

const mongoose = require('mongoose');

const emailAddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'User',
        required: true
    },
    emailAddress: {
        type: String,
        required:  true,
        unique: true
    },
    domain: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const EmailAddress = mongoose.model('EmailAddress',  emailAddressSchema);

module.exports = EmailAddress;