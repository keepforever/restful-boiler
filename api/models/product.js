const mongoose = require('mongoose')

// Schema tells mongoose what a saved "Product" should look like

const productSchema = mongoose.Schema({
      _id:   mongoose.Schema.Types.ObjectId,
     name:   {type: String, required: true},
    price:   {type: Number, required: true },
    productImage: {type: String, required: true}
});

// Schema is like layout.  Models is object gives constructor to build
// based on Schema defined above
module.exports = mongoose.model('Product', productSchema)
// 'Product', name of model as you want to use it internally
