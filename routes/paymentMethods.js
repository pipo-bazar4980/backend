const express = require('express');
const {createMethod, findAllMethod, findOneMethod, removeMethod, updateMethod} = require('../controllers/paymentMethod');
const {protect} = require("../middleware/auth");
const upload = require("../middleware/multer");

const router = express.Router();

router.route('/').post(protect,upload.single("image"),createMethod);
router.route('/').get(findAllMethod);
router.route('/:_id').get(protect, findOneMethod);
router.route('/:_id').put(protect,upload.single("image"), updateMethod);
router.route('/delete/:_id').delete(protect, removeMethod);

module.exports = router