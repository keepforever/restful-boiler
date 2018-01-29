const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);

// in building the orderSchema we create a "relation" to
// the productSchema via the 'ref' property in product object
// above.
// ref should hold a string with the name of the model you want
// to connect THIS model to. 
