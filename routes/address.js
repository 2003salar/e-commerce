const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../isUserAuthenticated');

const { Addresses, Users } = require('../models');

// Get the address 
router.get('/', isUserAuthenticated, async (req, res) => {
    try {
        const address = await Addresses.findOne({
            where: {
                user_id: req.user.id,
            },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'username']
                }
            ]
        });
        if (!address) {
            return res.status(404).json({success: false, message: 'You do not have an address'});
        }
        res.status(200).json({success: true, address})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
})

// Create an address
router.post('/', isUserAuthenticated, async (req, res) => {
    try {
        const { street, city, state, zip_code, country } = req.body;
        if (!street || !city || !state || !zip_code || !country) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        }

        const existingAddress = await Addresses.findOne({
            where: {
                user_id: req.user.id,
            }
        });
        
        if (existingAddress) {
            return res.status(400).json({success: false, messsage: 'You already have an address'});
        }

        const newAddress = await Addresses.create({
            user_id: req.user.id,
            street,
            city,
            state,
            zip_code,
            country,
        }); 
        res.status(201).json({success: true, newAddress });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Edit an address
router.patch('/', isUserAuthenticated, async (req, res) => {
    try {
        const address = await Addresses.findOne({
            where: {
                user_id: req.user.id,
            },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'username']
                }
            ]
        });

        if (!address) {
            return res.status(404).json({success: false, message: 'You do not have an address added.'});
        }
        const updatedParts = {...req.body};
        delete updatedParts.user_id;
        delete updatedParts.createdAt;
        delete updatedParts.updatedAt;

        const newAddress = await address.update(updatedParts);
        res.status(200).json({success: true, newAddress});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Delete an address
router.delete('/', isUserAuthenticated, async (req, res) => {
    try {
        const address = await Addresses.findOne({
            where: {
                user_id: req.user.id,
            }
        });
        if (!address) {
            return res.status(400).json({success: false, message: 'You do not have an address'});
        }

        await address.destroy()
        res.status(200).json({success: true, message: 'Address successfully deleted'});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

module.exports = router;