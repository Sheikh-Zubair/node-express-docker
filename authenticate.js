const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');

const config = require('./config');

const User = require('./models/user');



exports.local = passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);

// this will handle our support for session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 3600 });
};

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
};

exports.jwtPassport = passport.use(new JwtStrategy(options,
    (jwtPayload, done) => {
        console.log({ jwtPayload });
        User.findOne({ _id: jwtPayload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                done(null, false);
            }
        })
    })
);

exports.verifyUser = passport.authenticate('jwt', { session: false });