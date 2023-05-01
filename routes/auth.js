const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

const authRouter = express.Router();

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

authRouter.delete("/api/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.get("/api/signup", async (req, res) => {
  try {
    console.log("SIGNUP");
    const userId = makeid(5);
    const password = makeid(10);
    console.log(userId, password);
    const existingUser = await User.findOne({ userId });

    while (existingUser != null) {
      userId = makeid(5);
      existingUser = await User.findOne({ userId });
    }

    // if (existingUser) {
    //   return res
    //     .status(400)
    //     .json({ msg: "User with same user already exists!" });
    // }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      userId,
      password: hashedPassword,
    });

    user = await user.save();
    user.password = password;
    res.json(user);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/api/signin", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this User Id does not exist!" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password." });
    }
    const token = jwt.sign({ id: user.id }, "passwordKey");
    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.get("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (e) {
    res.status(500).json(false);
  }
});

authRouter.post("/api/addEmail", auth, async (req, res) => {
  try {
    const { email } = req.body;
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ msg: "Email already exists!" });
    const user = await User.findById(req.user);
    user.email = email;
    await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = authRouter;
