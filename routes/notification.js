const express = require('express');
const {createNotifications,getNotifications,editNotifications} = require('../controllers/notification');
const {protect} = require("../middleware/auth");


const router = express.Router();

router.route('/:id').post(protect,createNotifications);
router.route('/:id').get(protect,getNotifications);
router.route('/:id').put(editNotifications);

module.exports = router