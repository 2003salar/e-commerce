const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../isUserAuthenticated');
const addressesRoute = require('./address');
const ordersRoute = require('./orders');

const { sequelize, Products, Orders, OrderItems, Addresses, Users } = require('../models');

router.use('/addresses', addressesRoute);
router.use('/orders', ordersRoute);

module.exports = router;