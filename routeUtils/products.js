// helper functions to distribute state immutably and clean up reducers.
const Product = require('../api/models/product');
const mongoose = require('mongoose');

module.exports = {
    getAllProducts: function(req, res, next) {
        Product.find().select('name price _id'). // tell which props to fetch
        exec().then(docs => {
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
        }).catch(err => {
            console.log(err)
            res.status(500).json({error: err});
        });

    },

    postNewProduct: function(req, res, next) {
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
    },

    getSingleProduct: function(req, res, next) {
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
    },

    patchSingleProduct: function (req, res, next) {
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
    },

    deleteSingleProduct: function(req, res, next){
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
    }
}
