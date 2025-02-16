// const express = require('express');
// const passport = require('passport');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const router = express.Router();

// // router.post('/register', async (req, res) => {
// //     try {
// //         const { email, password } = req.body;
// //         const user = await User.create({ email, password });
// //         res.status(201).json(user);
// //     } catch (err) {
// //         res.status(400).json({ error: err.message });
// //     }
// // });

// // router.post('/login', async (req, res) => {
// //     try {
// //         const { email, password } = req.body;
// //         const user = await User.findByEmail(email);
// //         const isMatch = await bcrypt.compare(password, user.password);
// //         if (!isMatch) {
// //             return res.status(400).json({ error: 'Invalid credentials' });
// //         }
// //         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //         res.json({ token });
// //     } catch (err) {
// //         res.status(400).json({ error: err.message });
// //     }
// // });
// router.get('/login', passport.authenticate('github'), (req, res) => {});

// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// router.get('/github/callback', 
//     passport.authenticate('github', { failureRedirect: '/' }),
//     (req, res) => {
//         res.redirect('/');
//     }
// );
// // router.get(
// //     '/github/callback',
// //     passport.authenticate('github', {
// //       failureRedirect: '/api-docs',
// //       session: false,
// //     }),
// //     (req, res) => {
// //       req.session.user = req.user;
// //       res.redirect('/');
// //     }
// //   );

// // router.get('/logout', (req, res) => {
// //     req.logout();
// //     res.redirect('/');
// // });
// router.get('/logout', (req, res, next) => {
//     req.logout((err) => {
//         if (err) { return next(err); }
//         res.redirect('/');
//     });
// });

// router.get('/', (req, res) => {
//     res.send(
//         req.session.user !== undefined
//             ? `Logged in as ${req.session.user.displayName}`
//             : 'Logged Out'
//     );
// });

// module.exports = router;
const express = require('express');
const passport = require('passport');
const router = express.Router();
router.get('/login', passport.authenticate('github'), (req, res) => {});
// Initial GitHub auth route
router.get('/github', passport.authenticate('github', { 
    scope: ['user:email'] 
}));

// // GitHub callback route
// router.get('/github/callback', 
//     passport.authenticate('github', { 
//         failureRedirect: '/',
//         successRedirect: '/'
//     })
// );

// router.get(
//     '/github/callback',
//     passport.authenticate('github', {
//       failureRedirect: '/api-docs',
//       session: true,
//     }),
//     (req, res) => {
//       req.session.user = req.user;
//       res.redirect('/');
//     }
//   );
// In your auth.js routes
router.get('/github/callback',
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

// Home route
router.get('/', (req, res) => {
    res.send(
        req.session.user !== undefined
            ? `Logged in as ${req.session.user.displayName}`
            : 'Logged Out'
    );
});

module.exports = router;
