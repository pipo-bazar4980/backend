const express = require('express')
const {updateUser, deleteUser, getOneUser, getAllUser, getUserStats,updateUserRole,updateUserWallet,updateUserActiveStatus,addProduct, deleteAllProduct,addAdminProduct,deleteProduct,findUserByPhoneNumber,otpSend, updatePassword,
    updateUserPassword, updatePhoneVerify,getAllUserList,getActiveUserList
} = require('../controllers/user')
const {protect} = require("../middleware/auth");
const {verifyAllAdmin} = require("../middleware/verifyAllAdmin");
const {verifySuperAdmin} = require("../middleware/verifySuperAdmin");
const upload = require("../middleware/multer");
const {getJwt,removeJwt} =require('../controllers/auth')
const {verifyPassword} = require("../middleware/verifyPassword");
const router = express.Router()

router.route('/update/:id').put(protect,upload.single("image"), updateUser);
router.route('/updateVerify/:id').put(protect,upload.single("image"), updatePhoneVerify);
router.route('/updatePassword/:id').put( protect, verifyPassword,updatePassword);
router.route('/update/password/:id').put( protect, updatePassword);
router.route('/:id').delete(protect,verifyAllAdmin, deleteUser);
router.route('/find/:id').get( getOneUser);
router.route('/all_user').get(protect,verifyAllAdmin, getAllUser);
router.route('/stats').get(protect, verifyAllAdmin, getUserStats)
router.route('/roleUpdate/:id').put(protect,verifySuperAdmin, updateUserRole);
router.route('/walletUpdate/:id').put(protect,updateUserWallet);
router.route('/activeStatusUpdate/:id').put(protect,updateUserActiveStatus);
router.route('/add/product').put(protect,addProduct);
//router.route('/add/product').post(protect,addAdminProduct );
router.route('/delete/product/:id').delete(protect,deleteProduct);
router.route('/delete/product/all/admin').delete(protect,deleteAllProduct);
router.route('/get/jwt').get(getJwt);
router.route('/remove/jwt').get(removeJwt);
router.route('/find/number/:phonenumber').get(findUserByPhoneNumber);
router.route('/otp/:id').put(otpSend);
router.route('/edit/password/:id').put(updateUserPassword);
router.route('/all/users').get(protect,getAllUserList);
router.route('/active/users').get(getActiveUserList);

module.exports = router;




