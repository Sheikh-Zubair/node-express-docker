const express = require('express');

const User = require('../models/user');
const userRouter = express.Router();

userRouter.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {
    const { userName, password, admin } = req.body;
    console.log('signup', {userName});
    User.findOne({ userName })
        .then((user) => {
            if (user) {
                const err = new Error('User ' + userName + ' already exists');
                err.status = 403;
                next(err);
            } else {
                console.log('signup creating user');
                return User.create({ userName, password, admin: admin || false });
            }
        })
        .then(user => {
            console.log('signup user created');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                status: 'Registration Successful!',
                user: {
                    userName: user.userName,
                    admin: user.admin
                }
            });
            console.log('signup response sent');
        })
        .catch(err => next(err));
});

userRouter.post('/login', (req, res, next) => {
    if (!req.session.user) {
        console.log('inside login');
        const authHeader = req.headers.authorization;
        console.log('inside login', {authHeader});
        if (!authHeader) {
            const err = new Error('User is not authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
        const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const [username, password] = auth;
        console.log('inside login', {auth: {username}});
        User.findOne({ userName: username })
            .then(user => {
                if (user && user.password === password) {
                    req.session.user = 'authenticated';
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({
                        status: 'Login Successful!',
                        user: {
                            userName: user.userName,
                            admin: user.admin
                        }
                    });
                } else if (user.password !== password) {
                    const err = new Error('Your username or password is incorrect');
                    err.status = 403;
                    return next(err);
                } else {
                    const err = new Error('User ' + username + ' does not exists');
                    err.status = 403;
                    return next(err);
                }
            })
            .catch(err => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            status: 'You are already authenticated'
        });
    }
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