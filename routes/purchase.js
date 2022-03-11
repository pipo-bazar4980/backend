const express = require('express')
const {createNewPurchase,getAllPurchaseById,getAllPurchase} = require('../controllers/purchase')
const {protect} = require("../middleware/auth");
const {check}=require("../middleware/check")

const router = express.Router()

router.route('/').post(protect,createNewPurchase)
router.route('/:id').get(protect,getAllPurchaseById)
router.route('/').get(protect,getAllPurchase )

module.exports = router