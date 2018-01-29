const express = require('express');
const router = express.Router();
// Schema for product
const Product = require('../models/product');
const mongoose = require('mongoose')

// if you do not pass argument to find(), it will return all prods
// here is where you would also set a limit or pagination.
router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id') // tell which props to fetch
        .exec()
        .then(docs => {
            // adding meta data to response
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: { // optional meta information
                            type: "GET",
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
});
// after including body-parser in app.js we can create new product objects
// body-parser decorates the req with a body object, which then has
// a name property because the documentation for the api would specify
// 'name' as a required property.
router.post('/', (req, res, next) => {
    // console.log("POST-req.body", req.body);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    // save is a method provided by mongoose that can be used on mongoose models.
    product
        .save()
        .then(result => {
            console.log(product)
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id') // tell which props to fetch
        .exec()
        .then(doc => {
            console.log("doc as recieved from database: ", doc);
            if (doc) {
                res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + doc._id
                }})
            } else {
                res.status(404).json({
                    message: 'no valid entry found'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err});
        });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  // console.log("req.body = ", req.body);
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId // ss defined in router.delete();
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product Deleted",
                request: {
                    type: 'POST', 
                    url: 'http://localhost:3000/products',
                    body: {name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
