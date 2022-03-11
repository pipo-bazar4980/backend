const express = require('express')
const {protect} = require("../middleware/auth");
const {logout_User} = require("../controllers/logout");
;


const router = express.Router();

router.route('/logout').get(protect,logout_User);

module.exports = router