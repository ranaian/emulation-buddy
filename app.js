"use strict";
require("dotenv").config();
const express = require("express");
const path = require("path");
const gameRoutes = require("./src/routes/router");

const app = express();

const fs = require("fs").promises;
const multer = require("multer");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/games", gameRoutes);

const session = require("express-session");
const passport = require("passport");
require("./src/auth/passport");
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", __dirname + "/public");
app.get("/", (req, res) => {
  res.render("index", {
    googleClientId: process.env.clientID,
    user: req.user || null,
  });
});
app.use("/auth", require("./src/auth/authRoute"));
app.use("/users", require("./src/routes/userRoutes"));

app.get("/api/session-check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      loggedIn: true,
      user: {
        email: req.user.emails[0].value,
        name: req.user.displayName || req.user.name || "Unknown User",
      },
    });
  } else {
    res.json({ loggedIn: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server listening on port: " + PORT + "!");
});
