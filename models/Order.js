const { Schema, model } = require('mongoose');

module.exports.Order = model('Order', Schema({
    orderId: {
        type: Number,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
    },
    purchaseId: {
        type: Schema.Types.ObjectId,
        ref: 'Purchase',
        required: true,
    },
    rechargeId: {
        type: Schema.Types.ObjectId,
        ref: 'AddWallet',

    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    handOver: {
        type: Boolean,
        default: false
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    orderConfirmationTime:{
        type:Number,
        default: 0
    },
    orderCreationTime:{
        type:Number
    },
    reject: {
        type: Boolean,
        default: false
    },
    handOverAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        default: null
    },
    rejectReason: {
        type: String,
    },
    paymentComplete: {
        type: Boolean,
        default: false
    }

}, { timestamps: true }));

