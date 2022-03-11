const express = require('express')
const { sendMessage,sendMessageAllUser } = require('../utils/sendMessage')
const router = express.Router()


router.route('/').post(sendMessage);
router.route('/allUser').post(sendMessageAllUser);
module.exports = router;


