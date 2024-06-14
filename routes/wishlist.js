const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../isUserAuthenticated');

const { Products, WishlistItems } = require('../models');

// Get all products in the wishlist 
router.get('/', isUserAuthenticated, async (req, res) => {
    try {
        const wishlistItems = await WishlistItems.findAll({
            where: {
                user_id: req.user.id,
            }, 
            include: [
                {
                    model: Products,
                    as: 'product',
                    key: 'product_id',
                }
            ]
        });
        res.status(200).json({success: true, wishlistItems, hits: wishlistItems.length }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
})

// Add a product to the wishlist 
router.post('/:id', isUserAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid product id'});
        }
        const product = await Products.findByPk(id);
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'});
        }

        const itemExists = await WishlistItems.findOne({
            where: {
                user_id: req.user.id,
                product_id: id,
            }
        });

        if (itemExists) {
            return res.status(400).json({ success: false, message: 'Item already exists in your wishlist'});
        }

        const newWishlist = await WishlistItems.create({
            user_id: req.user.id,
            product_id: id,
        });
        
        const wishlistWithAssociations =  await WishlistItems.findOne({
            where: {
                id: newWishlist.id,
            },
            include: [
                {
                    model: Products,
                    as: 'product',
                    key: 'id',
                }
            ]
        })
        res.status(201).json({ success: true, wishlistWithAssociations });
    } catch (error) {   
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Remove a product from the wishlist
router.patch('/:id', isUserAuthenticated, async  (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid product id'});
        }
        const wishlistItem = await WishlistItems.findOne({
            where: {
                user_id: req.user.id,
                product_id: id,
            }, 
        });
        if (!wishlistItem) {
            return res.status(404).json({success: false, message: 'Item not found'});
        }

        await wishlistItem.destroy();
        res.status(200).json({success: true, message: 'Item removed successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});
module.exports = router;