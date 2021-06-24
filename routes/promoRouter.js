const express = require('express');

const promotionsRouter = express.Router();

promotionsRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the promotions for you!');
    })
    .post((req, res, next) => {
        res.end(`Will add the dish: ${req.body.name} with details ${req.body.description}`);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on promotions');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the promotions');
    });

promotionsRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end(`Will send details of the promo: ${req.params.promoId} to you!`);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on promo: '+req.params.promoId);
    })
    .put((req, res, next) => {
        res.write(`Updating the promo: ${req.params.promoId} \n`);
        res.end(`Will update the promo: ${req.body.name} with details ${req.body.description}`);
    })
    .delete((req, res, next) => {
        res.end(`Deleting promo: ${req.params.promoId}`);
    });

module.exports = promotionsRouter; 