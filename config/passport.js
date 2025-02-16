const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

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
async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('GitHub profile:', profile);
        const user = {
            id: profile.id,
            displayName: profile.displayName || profile.username,
            username: profile.username,
            email: profile.emails?.[0]?.value
        };
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));