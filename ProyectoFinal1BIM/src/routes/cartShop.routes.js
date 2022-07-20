'use strict'

const express = require('express');
const api = express.Router();
const cartShopController = require('../controllers/cartShop.controller');
const middleware = require('../services/middleware');

api.get('/testCartShopController', middleware.isLoged, cartShopController.testCartShopController);
api.put('/addProduct/', [middleware.isLoged, middleware.isClient], cartShopController.addProduct);

module.exports = api;