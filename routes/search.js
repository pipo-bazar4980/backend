const express = require('express');
const { findProducts} = require('../controllers/search');


const router = express.Router();

router.route('/').get(findProducts);

module.exports = router;