'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('../src/routes/user.routes');
const categoryRoutes = require('../src/routes/category.routes');
const productRoutes = require('../src/routes/product.routes');
const cartShopRoutes = require('../src/routes/cartShop.routes');
const billRoutes = require('../src/routes/bill.routes');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/cartShop', cartShopRoutes);
app.use('/bill', billRoutes);

module.exports = app;
