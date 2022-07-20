'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    phone: String,
    username: String, 
    password: String,
    role: String
});

module.exports = mongoose.model('User', userSchema);