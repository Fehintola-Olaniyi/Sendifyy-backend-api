// Data models(like for users, emails)

// Define user data schema

// const { type } = require('express/lib/response');

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true, //make sure users have a custom domain
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

const User = mongoose.model("User", UserSchema);
module.exports = User;
