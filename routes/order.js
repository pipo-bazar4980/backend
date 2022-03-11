const express = require('express')
const {createNewOrder,getOrders,updateOrderStatus,getOrdersById,getOrdersByAdminId,markAllComplete} = require('../controllers/order')
const {orderQueue} = require('../controllers/orderQueue')
const {protect} = require("../middleware/auth");

const router = express.Router()

router.route('/').post(protect,createNewOrder,orderQueue)
router.route('/').get(orderQueue)
router.route('/all').get(protect,getOrders)
router.route('/:id').get(protect,getOrdersByAdminId)
router.route('/user/:id').get(protect,getOrdersById)
router.route('/:id').put(updateOrderStatus)
router.route('/mark/All').put(markAllComplete)

module.exports = router