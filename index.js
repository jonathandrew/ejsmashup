const express = require("express");
const app = express();
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const cookiePArser = require("cookie-parser");
const session = require("express-session");
let MongoStore = require("connect-mongo")(session);
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");
const request = require("request");

require("dotenv").config();
const port = process.env.PORT || "3000";

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => {
    console.log(`Mongo Error: ${err}`);
  });

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookiePArser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      mongooseConnection: mongoose.connection,
      autoReconnect: true
    }),
    cookie: {
      secure: false,
      maxAge: 6000000
    }
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/randomusers", (req, res) => {
  request("https://randomuser.me/api/?results=20", (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const user = JSON.parse(body);
      res.render("main/random", { user: user });
    }
  });
});

app.get("/movies", (req, res) => {
  res.render("main/movies");
});

app.listen(port, () => {
  console.log(`server is running on  ${port}`);
});
