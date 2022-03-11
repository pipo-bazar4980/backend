const express = require('express');
const {getOneOrder} = require('../controllers/handleOrder');
const {protect} = require("../middleware/auth");
const {adminQueueAdd} = require("../controllers/adminQueue");

const router = express.Router();

router.route('/').get(protect, getOneOrder);
router.route('/').post(protect,  adminQueueAdd)


module.exports = router