const express = require('express');
const { create, update,updateImage, findAll, findOne, remove, filterAdminProduct, filterProductByDate, createTopUp, deleteTopUp, updateTopUp } = require('../controllers/products');
const { protect } = require("../middleware/auth");
const upload = require("../middleware/multer");

const router = express.Router();

router.route('/').post(protect, upload.single("image"), create);
router.route('/update/:id').put(protect, update);
router.route('/update/image/:id').put(protect, upload.single("image"), updateImage);
router.route('/').get(findAll);
router.route('/:_id').get(findOne);
router.route('/delete/:_id').delete(protect, remove);
router.route('/filter/date/').post(filterProductByDate);
router.route('/filter/admin/product/:id').get(protect, filterAdminProduct);
router.route('/topUp/:id').put(protect, createTopUp )
router.route('/topUp/:id/:topUpId').delete(protect, deleteTopUp )
router.route('/topUp/update/:id/').put(updateTopUp )

module.exports = router;
