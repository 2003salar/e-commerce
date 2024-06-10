const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../isUserAuthenticated');

const { sequelize, Products, Orders, OrderItems } = require('../models');

// Buy a new product
router.post('/:id', isUserAuthenticated, async (req, res) => {
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
            return res.status(404).json({success: false, message: 'Product not found'});
        }

        if (product.quantity < quantity) {
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
        res.status(201).json({success: true, newOrder, newOrderItems });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});


module.exports = router;