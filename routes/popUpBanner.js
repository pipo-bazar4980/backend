const express = require('express');
const { createPopUpBanner, deletePopUpBanner, findOnPopupBanner, updatePopUpBanner } = require('../controllers/popBanner');
const { protect } = require("../middleware/auth");
const upload = require("../middleware/multer");

const router = express.Router();

router.route('/').post( upload.single("image"), createPopUpBanner);
router.route('/:_id').get(findOnPopupBanner);
router.route('/:_id').put(protect, upload.single("image"), updatePopUpBanner);

module.exports = router
