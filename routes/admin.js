const express = require('express');
const router = express.Router();
const isUserAdmin = require('../isUserAdmin');
const categoriesRoute = require('./category');
const { Users, Categories } = require('../models');

router.get('/', isUserAdmin, (req, res) => {
    res.status(200).json({success: true, message: 'Hello again dear admin'});
});

router.get('/users', isUserAdmin, async (req, res) => {
    try {
        const users = await Users.findAll({
            where: {
                isAdmin: false,
            },
            attributes: ['id', 'username', 'email', 'createdAt', 'isAdmin'],
        });
        res.status(200).json({ success: true, users, hits: users.length });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'})
    }
});

router.use('/categories', categoriesRoute);

module.exports = router;