'use strict'

const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    cartShop: {type: mongoose.Schema.ObjectId, ref: 'CartShop'},
    date: Date,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    products:[{product:{
        productId: {type: mongoose.Schema.ObjectId, ref: 'Product'}, 
        name: String,
        price: Number,
        amount: Number,
        subTotal: Number,
        }
    }],
    total: Number
});

module.exports = mongoose.model('Bill', billSchema);