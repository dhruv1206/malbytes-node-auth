const mongoose = require("mongoose");

const spamMessageSchema = mongoose.Schema(
  {
    // who send the message
    messageFrom: {
      required: true,
      type: String,
      trim: true,
    },

    // message content
    description: {
      required: true,
      type: String,
      trim: true,
    },

    // number of times this message has been read
    timesRead: {
      required: true,
      type: Number,
      default: 0,
    },

    // number of times this message has not been read
    timesUnread: {
      required: true,
      type: Number,
      default: 0,
    },

    // ratings given by users ( higher rating means more authentic message )
    ratingsCount: {
      required: true,
      type: Number,
      default: 0,
    },

    // average rating of the message
    avgRating: {
      required: true,
      type: Number,
      default: 0,
    },

    // spam score of the message (calculated using the above parameters)
    spamScore: {
      required: true,
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SpamMessage = mongoose.model("SpamMessage", spamMessageSchema);
module.exports = SpamMessage;
