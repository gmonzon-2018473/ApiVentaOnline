'use strict'

const express = require('express');
const api = express.Router();
const categoryController = require('../controllers/category.controller');
const middleware = require('../services/middleware');

api.get('/testCategoryController', middleware.isLoged, categoryController.testCategoryController);
api.post('/saveCategory', [middleware.isLoged, middleware.isAdmin], categoryController.saveCategory);
api.put('/updateCategory/:id', [middleware.isLoged, middleware.isAdmin], categoryController.updateCategory);
api.delete('/deleteCategory/:id', [middleware.isLoged, middleware.isAdmin], categoryController.deleteCategory);
api.get('/getCategories', middleware.isLoged, categoryController.getCategories);

module.exports = api;

