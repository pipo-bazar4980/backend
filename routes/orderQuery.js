const express = require('express')
const {oneDayOrder,adminOrderQuery} = require('../controllers/orderQuery')
const {revenueCount} = require('../controllers/revenueCount')
const {protect} = require("../middleware/auth");

const router = express.Router()

router.route('/oneday').get(oneDayOrder)
router.route('/revenue/count').get(revenueCount)
router.route('/admin_order/query').get(adminOrderQuery)

module.exports = router