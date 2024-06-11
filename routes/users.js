const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../isUserAuthenticated');
const validateCard = require('../validateCard');

const addressesRoute = require('./address');
const ordersRoute = require('./orders');

const { sequelize, Products, Orders, OrderItems, Addresses, Users } = require('../models');

router.use('/addresses', addressesRoute);
router.use('/orders', ordersRoute);

router.post('/payment', isUserAuthenticated, async (req, res) => {
    try {
        
    } catch (error) {
        
    }
});

module.exports = router;