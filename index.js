// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
// IMPORTS FROM OTHER FILES
const authRouter = require("./routes/auth");
const spamRouter = require("./routes/spam");

// INIT
const PORT = process.env.PORT || 3000;
const app = express();
const DB =
  "mongodb+srv://malbytes_adhi:malbytes_adhi@malbytes.ccys6gy.mongodb.net/?retryWrites=true&w=majority";

// middleware
app.use(express.json());
app.use(authRouter);
app.use(spamRouter);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection successfull with MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
