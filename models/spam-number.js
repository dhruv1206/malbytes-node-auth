const mongoose = require("mongoose");

const spamNumberSchema = mongoose.Schema(
  {
    // number of the spammer
    number: {
      required: true,
      type: String,
      trim: true,
    },

    // number of times this number has been dialed
    timesDialed: {
      required: false,
      type: Number,
      default: 0,
    },

    // number of times this number has been missed
    timesMissed: {
      required: false,
      type: Number,
      default: 0,
    },

    // number of times this number has been picked
    timesPicked: {
      required: false,
      type: Number,
      default: 0,
    },

    // number of times this number has been rejected
    timesRejected: {
      required: false,
      type: Number,
      default: 0,
    },

    // ratings given by users ( higher rating means more authentic number )
    ratingsCount: {
      required: false,
      type: Number,
      default: 0,
    },

    // average rating of the number
    avgRating: {
      required: false,
      type: Number,
      default: 0,
    },

    // spam score of the number (calculated using the above parameters)
    spamScore: {
      required: false,
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SpamNumber = mongoose.model("SpamNumber", spamNumberSchema);
module.exports = SpamNumber;
