const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../isUserAuthenticated');

const { sequelize, Products, Orders, OrderItems } = require('../models');

// Get all orders
router.get('/', isUserAuthenticated, async (req, res) => {
    try {
        const orders = await Orders.findAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: OrderItems,
                    as: 'orderItem',
                    key: 'order_id',
                },
            ]
        });
        res.status(200).json({success: true, orders, hits: orders.length })
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Buy a new product
router.post('/buy/:id', isUserAuthenticated, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const user = req.user;
        const { id } = req.params; // product id 
        const { quantity } = req.body; // quantity of the product
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid product id'});
        }

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid quantity' });
        }

        const product = await Products.findByPk(id);
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({success: false, message: 'Product not found'});
        }

        if (product.quantity < quantity) {
            await transaction.rollback();
            return res.status(400).json({success: false, message: 'We do not have enough quantity'});
        }

        const newOrder = await Orders.create({
            user_id: user.id,
        }, {  transaction });
        const newOrderItems = await OrderItems.create({
            order_id: newOrder.id,
            product_id: product.id,
            quantity,
            price: product.price,
            total: product.price * quantity,
        }, { transaction });

        const updatedQuantity = product.quantity - quantity;
        await product.update({ quantity: updatedQuantity }, { transaction });
        await transaction.commit();
        res.status(201).json({success: true, newOrder, newOrderItems });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

// Track an order
router.get('/track/:id', isUserAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid order id'});
        }
        const order = await Orders.findByPk(id, {
            where: {
                user_id: req.user.id,
            }, 
            attributes: ['id', 'status'],
        });

        if (!order) {
            return res.status(404).json({success: false, message: 'Order not found'})
        }
        res.status(200).json({success: true, order});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'})
    }
});

module.exports = router;