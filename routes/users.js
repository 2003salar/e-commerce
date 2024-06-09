const express = require('express');
const router = express();

router.get('/', (req, res) => res.status(200).json({message: 'worked'}));

module.exports = router;