// const passport = require('passport');
// const GitHubStrategy = require('passport-github2').Strategy;
// const User = require('../models/user');

// passport.serializeUser((user, done) => {
//     done(null, user);
//   });
  
//   passport.deserializeUser((user, done) => {
//     done(null, user);
//   });


// // passport.use(new GitHubStrategy({
// //     clientID: process.env.GITHUB_CLIENT_ID,
// //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
// //     callbackURL: process.env.CALLBACK_URL || callbackURL
// // },
// // async (accessToken, refreshToken, profile, done) => {
// //     try {
// //         let user = await User.findByEmail(profile.emails[0].value);
// //         if (!user) {
// //             user = await User.create({
// //                 email: profile.emails[0].value,
// //                 name: profile.displayName || profile.username,
// //                 githubId: profile.id
// //             });
// //         }
// //         done(null, user);
// //     } catch (err) {
// //         done(err, null);
// //     }
// // }));

// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL
// },
// (accessToken, refreshToken, profile, done) => {
//     console.log('GitHub profile:', profile);
//     return done(null, profile);
// }));

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