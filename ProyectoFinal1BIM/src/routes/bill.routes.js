'use strict'

const express = require('express');
const api = express.Router();
const billController = require('../controllers/bill.controller');
const middleware = require('../services/middleware');

api.get('/testBillController', middleware.isLoged, billController.testBillController);
api.post('/createBill', [middleware.isLoged, middleware.isClient], billController.createBill);
api.get('/getBills/:id', [middleware.isLoged, middleware.isAdmin], billController.getBills);
api.get('/getBill/:id', [middleware.isLoged, middleware.isAdmin], billController.getBill);

module.exports = api;
