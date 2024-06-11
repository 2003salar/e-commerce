const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../isUserAuthenticated');

const addressesRoute = require('./address');
const ordersRoute = require('./orders');
const reviewsRoute = require('./review');

const { sequelize } = require('../models');

router.use('/addresses', addressesRoute);
router.use('/orders', ordersRoute);
router.use('/reviews', reviewsRoute);


module.exports = router;