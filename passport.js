const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
    clientID: '274110835292-j5b2jieqd794efns4clilbsqa9u51n7g.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://nihonchukosha.onrender.com/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});