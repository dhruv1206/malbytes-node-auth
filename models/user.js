const mongoose = require("mongoose");
const SpamMessage = require("./spam-message");
const SpamNumber = require("./spam-number");

const userSchema = mongoose.Schema(
  {
    userId: {
      required: true,
      type: String,
      trim: true,
    },
    email: {
      required: false,
      type: String,
      trim: true,
      validate: {
        validator: (val) => {
          const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return val.match(re);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      required: true,
      type: String,
      validate: {
        validator: (val) => {
          return val.length > 6;
        },
        message: "Please enter a long password!",
      },
    },
    //

    //
    // array of spam numbers marked by the user (array of models\spam-number.js)
    spamNumbers: [
      {
        number: {
          required: true,
          type: String,
          trim: true,
        },
        rating: {
          required: true,
          type: Number,
        },
      },
    ],
    // list of spam messages marked by the user (array of models\spam-message.js)

    type: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
