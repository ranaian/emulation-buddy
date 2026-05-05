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

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server listening on port: " + PORT + "!");
});
