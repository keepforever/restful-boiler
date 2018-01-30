const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const routeLogic = require('../../routeUtils/products');
const multer = require('multer');
// if you do not pass argument to find(), it will return all prods
// here is where you would also set a limit or pagination.
// multer is package for accepting images via form data.
// "dest:" specifies a folder where multer will try to store incoming files

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, (Math.random().toFixed(4) * 1000) + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    },
    fileFilter: fileFilter
});
// adjust how files get stored, set limits on size/type, etc.
// multer execute these functions when new file is recieved
// pass storage config into  upload.single({storage: storage});
// after including body-parser in app.js we can create new product objects
// body-parser decorates the req with a body object, which then has
// a name property because the documentation for the api would specify
// 'name' as a required property.
// Argument to upload.single('arg') specifies the name fo var that will hold
// the file.
router.post('/', upload.single('productImage'), (req, res, next) => {
    //console.log("POST-req.body", req.body);
    // console.log(req.file) shows what multer parsed
    routeLogic.postNewProduct(req, res, next);
});

router.get('/', (req, res, next) => {
    routeLogic.getAllProducts(req, res, next);
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
