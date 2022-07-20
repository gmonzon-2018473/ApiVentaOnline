'use stric'

const express = require('express');
const api = express.Router();
const productController = require('../controllers/product.controller');
const middleware = require('../services/middleware');

api.get('/testProductController', middleware.isLoged, productController.testProductController);
api.post('/saveProduct', [middleware.isLoged, middleware.isAdmin], productController.saveProduct);
api.get('/getProducts', middleware.isLoged, productController.getProducts);
api.get('/getProduct/:id', middleware.isLoged, productController.getProduct);
api.get('/soldOutProducts', middleware.isLoged, productController.soldOutProducts);
api.get('/productsMostSale', middleware.isLoged, productController.productsMostSale);
api.put('/updateProduct/:id', [middleware.isLoged, middleware.isAdmin], productController.updateProduct);
api.delete('/deleteProduct/:id', [middleware.isLoged, middleware.isAdmin], productController.deleteProduct);
api.post('/searchProducts', middleware.isLoged, productController.searchProducts);
api.post('/searchProductsByCategory', middleware.isLoged, productController.searchProductsByCategory);


module.exports = api;


