const express = require('express');

const leadersRouter = express.Router();

leadersRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the leaders for you!');
    })
    .post((req, res, next) => {
        res.end(`Will add the dish: ${req.body.name} with details ${req.body.description}`);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on leaders');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the leaders');
    });

leadersRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end(`Will send details of the leader: ${req.params.leaderId} to you!`);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on leader: '+req.params.leaderId);
    })
    .put((req, res, next) => {
        res.write(`Updating the leader: ${req.params.leaderId} \n`);
        res.end(`Will update the leader: ${req.body.name} with details ${req.body.description}`);
    })
    .delete((req, res, next) => {
        res.end(`Deleting leader: ${req.params.leaderId}`);
    });

module.exports = leadersRouter; 