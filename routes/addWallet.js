const express = require('express');
const {
    addWallet,
    findAllWallet,
    findOneWallet,
    updateWallet,
    removeWallet,
    filterTransaction,
    findTransactionById,
    editBalance,
    markAllPurchaseComplete
} = require('../controllers/addWallet');
const {protect} = require("../middleware/auth");


const router = express.Router();

router.route('/').post(protect, addWallet);
router.route('/').get(findAllWallet);
router.route('/:_id').get(findOneWallet);
router.route('/transaction/:_id').get(findTransactionById);
router.route('/:_id').put(protect, updateWallet);
router.route('/delete/:_id').put(protect, removeWallet);
router.route('/editAmount/:_id').put(protect, editBalance);
router.route('/filter/product').post(filterTransaction);
router.route('/mark/All').put(markAllPurchaseComplete)

module.exports = router