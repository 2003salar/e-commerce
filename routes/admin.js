const express = require('express');
const router = express.Router();
const isUserAdmin = require('../isUserAdmin');
const categoriesRoute = require('./category');
const productRoute = require('./products');
const { Users, Orders, OrderItems, Products } = require('../models');

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
router.use('/products', productRoute);

// Update the status
router.patch('/orders/:id', isUserAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid order id'});
        }
        const order = await Orders.findByPk(id, {
            include: [
                {
                    model: OrderItems,
                    as: 'orderItem',
                    key: 'order_id',
                    include: [
                        {
                            model: Products,
                            as: 'product',
                            key: 'id'
                        }
                    ]
                }
            ]
        });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found'});
        }
        const validStatuses = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({success: false, message: 'Invalid status'});
        }
        if (status === order.status ) {
            return res.status(400).json({success: false, message: 'The status is the same as current'});
        }
        await order.update({ status });
        const updatedOrder = await Orders.findByPk(id);

        res.status(200).json({ success: true, updatedOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'})
    }
});

module.exports = router;