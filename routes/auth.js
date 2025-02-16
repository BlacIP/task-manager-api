// module.exports = router;
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
    res.send(
        req.session.user !== undefined
            ? `Logged in as ${req.session.user.displayName}`
            : 'Logged Out'
    );
});

router.get('/github', passport.authenticate('github', { 
    scope: ['user:email'] 
}));

router.get('/login', passport.authenticate('github'), (req, res) => {});
// Initial GitHub auth route


router.get('github/callback',
    (req, res, next) => {
        console.log('Hitting callback route');
        next();
    },
    passport.authenticate('github', {
        failureRedirect: '/api-docs',
        session: true
    }),
    (req, res) => {
        console.log('Authentication successful');
        req.session.user = req.user;
        res.redirect('/');
    }
);


// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});



module.exports = router;
