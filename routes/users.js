const express = require('express');
const router = express.Router();

const addressesRoute = require('./address');
const ordersRoute = require('./orders');
const reviewsRoute = require('./review');
const wishlistRoute = require('./wishlist');


router.use('/addresses', addressesRoute);
router.use('/orders', ordersRoute);
router.use('/reviews', reviewsRoute);
router.use('/wishlists', wishlistRoute);



module.exports = router;