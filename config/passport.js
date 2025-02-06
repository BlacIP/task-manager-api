const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const callbackURL = process.env.NODE_ENV === 'production'
    ? 'https://task-manager-api-z4ad.onrender.com/auth/github/callback'
    : 'http://localhost:8000/auth/github/callback';

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: callbackURL
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findByEmail(profile.emails[0].value);
        if (!user) {
            user = await User.create({
                email: profile.emails[0].value,
                name: profile.displayName || profile.username,
                githubId: profile.id
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));