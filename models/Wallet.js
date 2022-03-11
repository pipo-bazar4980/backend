const mongoose = require('mongoose');
const { Schema} = require('mongoose');

const WalletSchema = new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'Auth',
        required:true,
        unique: true,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    spentAmount: {
        type: Number,
        default: 0,
    },
    currentAmount: {
        type: Number,
        default: 0,
    },
    totalOrder: {
        type: Number,
        default: 0,
    },
    disabled: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    })


const Wallet = mongoose.model("Wallet", WalletSchema)

module.exports = Wallet