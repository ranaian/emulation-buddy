const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const userModel = require("../config/userModel");
/* const authorizedUsers = process.env.authorizedUsers
  ? process.env.authorizedUsers.split(",").map((email) => email.trim())
  : [];
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "/auth/google/callback",
    },
    async (token, tokenSecret, profile, done) => {
      const userEmail = profile.emails[0].value;
      /* if (!authorizedUsers.includes(userEmail)) {
        return done(null, false, {
          message:
            "Unauthorized User, Emu Buddy does not require an account to use",
        });
      } */

      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
      };
      const user = await userModel.getUserById(profile.id);
      if (!user) {
        userModel.createNewUser(Object.values(newUser));
      }
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
