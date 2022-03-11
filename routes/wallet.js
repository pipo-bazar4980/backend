const express = require('express');
const {createWallet,getWalletById,getAllWallet,updateWallet,editBalance,deleteWallet,addSpentAmount,removeSpentAmount} = require('../controllers/wallet');
const {protect} = require("../middleware/auth");


const router = express.Router();

router.route('/').post(createWallet);
router.route('/:id').get(protect,getWalletById);
router.route('/').get(protect,getAllWallet);
router.route('/:id').put(protect,updateWallet);
router.route('/updateUserAmount/:id').put(protect,editBalance);
router.route('/addSpentAmount/:id').put(protect,addSpentAmount);
router.route('/removeSpentAmount/:id').put(protect,removeSpentAmount);
router.route('/:id').delete(protect,deleteWallet);

module.exports = router