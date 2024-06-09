const express = require('express');
const router = express.Router();
const isUserAdmin = require('../isUserAdmin');

const { Categories } = require('../models');

// Get all categories
router.get('/', isUserAdmin, async (req, res) => {
    try {
        const categories = await Categories.findAll();
        res.status(200).json({ success: true, categories, hits: categories.length });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Get a specific category 
router.get('/:id', isUserAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid category id'});
        }
        const category = await Categories.findByPk(id);
        if (!category) {
            return res.status(404).json({success: false, message: 'Category not found'});
        }
        res.status(200).json({success: true, category});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'})
    }
})

// Create a category
router.post('/', isUserAdmin, async(req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({success: false, message: 'Invalid category name'})
        }

        const category = await Categories.findOne({
            where: {
                name,
            }
        });
        if (category) {
            return res.status(400).json({success: false, message: 'Category already exists'});
        }

        const newCategory = await Categories.create({
            name,
        });

        res.status(201).json({success: true, newCategory});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'})
    }
});

// Delete a category 
router.delete('/:id', isUserAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid category id'});
        }  
        const category = await Categories.findByPk(id);

        if (!category) {
            return res.status(404).json({success: false, message: 'Category not found'});
        }

        await Categories.destroy({
            where: {
                id,
            }
        });
        
        res.status(200).json({success: true, message: 'Category successfully deleted'})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

module.exports = router;