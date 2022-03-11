const express = require('express');
const {createAdminNotifications,getAdminNotifications,editAdminNotifications} = require('../controllers/adminNotification');
const {protect} = require("../middleware/auth");


const router = express.Router();

router.route('/:id').post(protect,createAdminNotifications);
router.route('/:id').get(protect,getAdminNotifications);
router.route('/:id').put(editAdminNotifications);

module.exports = router;