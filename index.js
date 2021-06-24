const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);

// constants
const HOST_NAME = '0.0.0.0';
const PORT = 3000;
const SECRET_KEY = '123-124354645-7676';

// routes
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRoute = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const isDocker = process.env.IS_DOCKER || false;
const dockerdbUrl = 'mongodb://host.docker.internal:27017/conFusion';
const localdbUrl = 'mongodb://localhost:27017/conFusion';
const composedbUrl = 'mongodb://mongodb:27017/conFusion';
const dbUrl = isDocker ? composedbUrl : localdbUrl;//isDocker? dockerdbUrl:localdbUrl;
const connect = mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

connect.then((db) => {
    console.log('connected correctly to the server');
    console.log({ isDocker });
}, (err) => {
    console.log('inside error', err);
});

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(cookieParser(SECRET_KEY));
app.use(
    expressSession({
        name: 'session',
        secret: SECRET_KEY,
        saveUninitialized: false,
        resave: false,
        store: new FileStore()
    })
);

const basicAuth = (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const err = new Error('User is not authenticated');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
    const auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    const [username, password] = auth;
    if (username === 'admin' && password === 'password') {
        next();
    } else {
        const err = new Error('User is not authenticated');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
};

const cookieAuth = (req, res, next) => {
    console.log({ signedCookies: req.signedCookies });

    if (!req.signedCookies.user) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error('User is not authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
        const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const [username, password] = auth;
        if (username === 'admin' && password === 'password') {
            res.cookie('user', 'admin', { signed: true });
            next();
        } else {
            const err = new Error('User is not authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
    } else if (req.signedCookies.user === 'admin') {
        next();
    } else {
        const err = new Error('User is not authenticated');
        err.status = 401;
        return next(err);
    }
};

const expressSessionAuth = (req, res, next) => {
    console.log({expressSession: req.session});
    if (!req.session.user) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error('User is not authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
        const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const [username, password] = auth;
        if (username === 'admin' && password === 'password') {
            req.session.user = 'admin';
            next();
        } else {
            const err = new Error('User is not authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
    } else if (req.session.user === 'admin') {
        next();
    } else {
        const err = new Error('User is not authenticated');
        err.status = 401;
        return next(err);
    }
};

// app.use(basicAuth);
// app.use(cookieAuth);
app.use(expressSessionAuth);

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRoute);

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {


    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
        <html>
            <body>
                <h1> This is an express Server</h1>
            </body>
        </html>
    `);
});

app.use((err, req, res, next) => {
    console.log('global error handler');
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : err;

    // render the error page
    res.status(err.status || 500)
        .json({
            status: err.status,
            message: err.message
        });
    // res.render('error');
});

const server = http.createServer(app);

server.listen(PORT, HOST_NAME, () => {
    console.log(`Server is listening on http://${HOST_NAME}:${PORT}`);
});