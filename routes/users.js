const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../isUserAuthenticated');

const addressesRoute = require('./address');
const ordersRoute = require('./orders');
const reviewsRoute = require('./review');
const wishlistRoute = require('./wishlist');

const { Products, WishlistItems } = require('../models');

router.use('/addresses', addressesRoute);
router.use('/orders', ordersRoute);
router.use('/reviews', reviewsRoute);
router.use('/wishlists', wishlistRoute);



module.exports = router;