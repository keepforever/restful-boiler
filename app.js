const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(
    "mongodb://keepforever:" +
    process.env.MONGO_ATLAS_PW +
    "@learn-mongo-alpha-shard-00-00-14sf8.mongodb.net:27017,learn-mongo-alpha-shard-00-01-14sf8.mongodb.net:27017,learn-mongo-alpha-shard-00-02-14sf8.mongodb.net:27017/test?ssl=true&replicaSet=learn-mongo-alpha-shard-0&authSource=admin"
);
// directs incoming requests to appropriate api file folder path.
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
// for logging requests
app.use(morgan('dev'));
// extracts urlencoded data and makes readable to us.
app.use(bodyParser.urlencoded({
    extended: false
}));
// extracts json data and makes easily readable to us.
app.use(bodyParser.json());

// addressing CORS errors by appending appropriate headers to
// tell the browser "hey, everything is A-OK".
// '*' gives access to all requesters, could restrict it by
// 'http://my-cool-page.com'
app.use((req, res, next) =>  {
    res.header("Access-Control-Allow-Origin", "*");
// define which headers API accepts.
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
// Browser will send an OPTIONS request to see which types of requests
// are valid.
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({})
    }
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// handles and unknow requests and forward downstream
// to next middleware
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
// responds to error with json error object with message property.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
