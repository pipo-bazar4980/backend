const express = require('express')
const {createSupport,getSupportMessage, removeMethod,markSupport} = require('../controllers/support')
const {protect} = require("../middleware/auth");

const router = express.Router()

router.route('/:id').post( protect,createSupport);
router.route('').get( protect,getSupportMessage);
router.route('/:id').get( protect,removeMethod);
router.route('/:id').put(markSupport);

module.exports = router;