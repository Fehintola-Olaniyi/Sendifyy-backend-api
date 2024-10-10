// Data models(like for users, emails)

// Define user data schema

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const { type } = require('express/lib/response');

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, //this line is making the name field required
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    emailAddresses: [
      {
        type: String,
      },
    ],
    storageUsed: {
      type: Number,
      default: 0, // Storage in MB (convert to GB later)
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// dont know if this will be necessary later
// The primary purpose of this method is to verify if the provided password (candidatePassword) matches the stored hashed password (this.password). This is commonly used in authentication processes to validate user credentials.
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };
const User = mongoose.model("User", UserSchema);
module.exports = User;
