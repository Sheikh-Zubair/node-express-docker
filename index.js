const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const passport = require('passport');
const authenticate = require('./authenticate');

// constants
const HOST_NAME = '0.0.0.0';
const PORT = 3000;
const SECRET_KEY = '123-124354645-7676';

// routes
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRoute = require('./routes/leaderRouter');
const userRouter = require('./routes/users');

const mongoose = require('mongoose');

const config = require('./config');
// const isDocker = process.env.IS_DOCKER || false;
// const dockerdbUrl = 'mongodb://host.docker.internal:27017/conFusion';
// const localdbUrl = 'mongodb://localhost:27017/conFusion';
// const composedbUrl = 'mongodb://mongodb:27017/conFusion';
const dbUrl = config.isDocker ? config.mongoUrlDocker : config.mongoUrlLocal;
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
// app.use(
//     expressSession({
//         name: 'session-id',
//         secret: SECRET_KEY,
//         saveUninitialized: false,
//         resave: false,
//         store: new FileStore()
//     })
// );
app.use(passport.initialize());
// app.use(passport.session());

// const expressSessionAuth = (req, res, next) => {
//     console.log({ expressSession: req.session });
//     if (req.user) {
//         next();
//     } else {
//         const err = new Error('User is not authenticated');
//         err.status = 401;
//         return next(err);
//     }
// };

// so that the user route is accessible before authorization
app.use('/users', userRouter);

// app.use(basicAuth);
// app.use(cookieAuth);
// app.use(expressSessionAuth);

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