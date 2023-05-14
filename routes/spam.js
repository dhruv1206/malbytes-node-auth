const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const SpamNumber = require("../models/spam-number");

const spamRouter = express.Router();

spamRouter.post("/api/spam/mark-spam-call", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);

    const { number, rating } = req.body;
    if (rating > 5) {
      return res.status(400).json({ msg: "Rating cannot be greater than 5" });
    }
    // check if user has already marked this number as spam using the spamNumbers array which contain number attribute && if yes then we need to  update the rating of that number and also the avgRating of that number according to the new rating and remove changes that came in avgRating and spamScore due to previous rating,and return the updated spamNumber
    if (user.spamNumbers.find((spamNumber) => spamNumber.number == number)) {
      // get previous rating of the number
      const previousRating = user.spamNumbers.find(
        (spamNumber) => spamNumber.number == number
      ).rating;
      // update the rating of the number
      user.spamNumbers.find(
        (spamNumber) => spamNumber.number == number
      ).rating = rating;
      let spamNumber = await SpamNumber.findOne({ number });
      spamNumber.avgRating =
        spamNumber.avgRating +
        (rating - previousRating) / spamNumber.ratingsCount;
      let spamScore;
      if (spamNumber.timesPicked + spamNumber.timesRejected == 0) {
        spamScore = 2.5;
      } else {
        spamScore =
          ((spamNumber.timesDialed + spamNumber.timesMissed) /
            (spamNumber.timesPicked + spamNumber.timesRejected)) *
            (spamNumber.avgRating - 5) +
          5;
      }
      //spamScore =   ((spamNumber.timesDialed + spamNumber.timesMissed) * (spamNumber.timesPicked + spamNumber.timesRejected) * (spamNumber.ratingsCount / 10) * (spamNumber.avgRating / 5)) + (0.7 * spamNumber.currentSpamScore)
      spamNumber.spamScore = spamScore;
      spamNumber = await spamNumber.save();
      user = await user.save();
      return res.json(spamNumber);
    }

    let spamNumber = await SpamNumber.findOne({ number });
    if (!spamNumber) {
      spamNumber = new SpamNumber({
        number: number,
        avgRating: rating,
        ratingsCount: 1,
      });
      spamNumber = await spamNumber.save();
    } else {
      spamNumber.avgRating =
        (spamNumber.avgRating * spamNumber.ratingsCount + rating) /
        (spamNumber.ratingsCount + 1);
      spamNumber.ratingsCount += 1;
      let spamScore;
      if (spamNumber.timesPicked + spamNumber.timesRejected == 0) {
        spamScore = 2.5;
      } else {
        spamScore =
          ((spamNumber.timesDialed + spamNumber.timesMissed) /
            (spamNumber.timesPicked + spamNumber.timesRejected)) *
            (spamNumber.avgRating - 5) +
          5;
      }
      //spamScore =   ((spamNumber.timesDialed + spamNumber.timesMissed) * (spamNumber.timesPicked + spamNumber.timesRejected) * (spamNumber.ratingsCount / 10) * (spamNumber.avgRating / 5)) + (0.7 * spamNumber.currentSpamScore)
      console.log(spamScore);
      spamNumber.spamScore = spamScore;
      spamNumber = await spamNumber.save();
    }
    user.spamNumbers.push({ number, rating });
    user = await user.save();
    res.json(spamNumber);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = spamRouter;
