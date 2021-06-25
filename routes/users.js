const express = require('express');

const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const userRouter = express.Router();

userRouter.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {
    const { username, password, admin } = req.body;
    User.register(new User({username, admin}), password, (err, user) => {
        if(err) {
            res.status(500).json({error: err});
        } else {
            passport.authenticate('local')(req, res, () => {
                res.status(200).json({
                    sussess: true,
                    status: 'Registration Successful!',
                    user: {
                        username: user.username,
                        admin: user.admin
                    }
                });
            });
        }
    });
});


// if login failed password will send user the appropriate message
// other wise it will call next call back, with user prop in the req
userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
    const token = authenticate.getToken({
        username: req.user.username,
        admin: req.user.admin,
        _id: req.user._id
    });
    res.status(200).json({
        sussess: true,
        status: 'Login Successful!',
        token,
        user: {
            username: req.user.username,
            admin: req.user.admin
        }
    });
});

userRouter.get('/logout', (req, res, next) => {
    console.log('logout', {session: req.session});
    if (req.session) {
        // this will remove session from server
        req.session.destroy();
        // this allow client to delete the cookie
        res.clearCookie('session-id');
        // res.redirect('/');
        res.end('You are logged out!');
    } else {
        const err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});

module.exports = userRouter;