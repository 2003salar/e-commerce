const express = require('express');
const router = express.Router();
const isUserAdmin = require('../isUserAdmin');
const { Categories, Products, Reviews, Users } = require('../models');

// Get all products 
router.get('/', isUserAdmin, async (req, res) => {
    try {
        const products = await Products.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Reviews,
                    as: 'review',
                    key: 'product_id',
                    include: [
                        {
                            model: Users,
                            as: 'user',
                            key: 'user_id',
                            attributes: ['id', 'username', 'email', 'isAdmin']
                        }
                    ]
                }
            ]
        });
        res.status(200).json({success: false, products, hits: products.length});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'})
    }
});

// Get a specific product
router.get('/:id', isUserAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid product id'});
        }
        const product = await Products.findByPk(id);
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'});
        }
        res.status(200).json({ success: false, product });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'})
    }
});

// Create a product
router.post('/', isUserAdmin, async (req, res) => {
    try {
        const { name, description, price, category_id, image_url, quantity } = req.body;

        if (!name || !price || !category_id || isNaN(category_id) || !quantity || isNaN(quantity) ) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        }
        
        const category = await Categories.findByPk(category_id);
        if (!category) {
            return res.status(404).json({success: false, message: 'Category not found'});
        }
        const newProduct = await Products.create({
            name,
            description,
            price,
            category_id,
            image_url,
            quantity,
        });

        res.status(200).json({success: true, newProduct});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Update a product
router.patch('/:id', isUserAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid product id'});
        }
        const product = await Products.findByPk(id);
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'});
        }
        
        const updatedParts = {...req.body};
        delete updatedParts.createdAt;
        delete updatedParts.updatedAt;
        if (updatedParts.category_id) {
            const category = await Categories.findByPk(updatedParts.category_id);
            if (!category) {
                return res.status(400).json({success: false, message: 'Category not found'});
            }
        };
        
        await Products.update(updatedParts, {
            where: {
                id,
            }
        });

        const updatedProduct = await Products.findByPk(id);

        res.status(200).json({success: true, updatedProduct});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Delete a product
router.delete('/:id', isUserAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid product id'});
        }
        const product = await Products.findByPk(id);
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'});
        }

        await Products.destroy({
            where: {
                id,
            }
        });

        res.status(200).json({success: true, message: 'Products was successfully deleted'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

module.exports = router;