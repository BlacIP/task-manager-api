const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
dotenv = require('dotenv');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
    console.log('GitHub profile:', profile);
    return done(null, profile);
}));