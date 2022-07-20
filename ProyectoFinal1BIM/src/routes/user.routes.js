'use strict'

const express = require('express');
const api = express.Router();
const userControllorer = require('../controllers/user.controller');
const middleware = require('../services/middleware');

api.get('/testUserController', middleware.isLoged, userControllorer.testUserController);
api.post('/register', userControllorer.register);
api.post('/login', userControllorer.login);
api.put('/updateUser/:id', middleware.isLoged, userControllorer.updateUser);
api.put('/updateByAdmin/:id', [middleware.isLoged, middleware.isAdmin], userControllorer.updateByAdmin);
api.delete('/deleteUser/:id', middleware.isLoged, userControllorer.deleteUser);
api.delete('/deleteUserByAdmin/:id', [middleware.isLoged, middleware.isAdmin], userControllorer.deleteUserByAdmin);

module.exports = api;