const express = require('express');
const router = express.Router();
const isUserAdmin = require('../isUserAdmin');

router.get('/', isUserAdmin, (req, res) => {
    res.status(200).json({success: true, message: 'Hello again dear admin'});
})

module.exports = router;