const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');



exports.local = passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);

// this will handle our support for session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());