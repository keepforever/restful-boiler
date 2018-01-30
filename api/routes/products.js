const express = require('express');
const router = express.Router();
// Schema for product
const Product = require('../models/product');
const mongoose = require('mongoose');

const routeLogic = require('../../routeUtils/product');
// if you do not pass argument to find(), it will return all prods
// here is where you would also set a limit or pagination.



router.get('/', (req, res, next) => {
    routeLogic.getAllProducts(req, res, next);
});

// after including body-parser in app.js we can create new product objects
// body-parser decorates the req with a body object, which then has
// a name property because the documentation for the api would specify
// 'name' as a required property.
router.post('/', (req, res, next) => {
    // console.log("POST-req.body", req.body);
    routeLogic.postNewProduct(req, res, next);
});

router.get('/:productId', (req, res, next) => {

    routeLogic.getSingleProduct(req, res, next);

});

router.patch("/:productId", (req, res, next) => {
    routeLogic.patchSingleProduct(req, res, next);
});

router.delete('/:productId', (req, res, next) => {
    routeLogic.deleteSingleProduct(req, res, next);
});

module.exports = router;
