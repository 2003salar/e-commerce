const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../isUserAuthenticated');

const { Products, Reviews } = require('../models');

// Create a review 
router.post('/:id', isUserAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid product id'});
        }
        const product = await Products.findByPk(id);
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'});
        }
        
        if (!rating || !(rating >= 1 && rating <= 5)) {
            return res.status(400).json({success: false, message: 'Invalid rating; rating has to be between 1 and 5'});
        }

        const newReview = await Reviews.create({
            user_id: req.user.id,
            product_id: id,
            rating,
            comment,
        });

        res.status(201).json({success: true, newReview });

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

module.exports = router;