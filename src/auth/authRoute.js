const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    keepSessionInfo: true,
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    keepSessionInfo: true,
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect(req.session.returnTo);
  },
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // Destroy the session to clear the session cookie
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({ message: "Error destroying session" });
      }
    });
    res.redirect("/");
  });
});

module.exports = router;
