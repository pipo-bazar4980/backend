const mongoose = require('mongoose');
const { Schema} = require('mongoose');
const Joi = require('joi');

const AddWalletSchema = new mongoose.Schema({
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
    paymentType: {
        type: String,
        required: true,
    },
    transactionID: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNumber: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    reject: {
        type: Boolean,
        default: false
    },
    rejectReason: {
        type: String,
    },
    
},
    {
        timestamps: true
    })


const AddWallet = mongoose.model("AddWallet", AddWalletSchema)

const validateTransaction = transaction => {
    const schema = Joi.object({
        paymentType:Joi.string().required().messages({'string.empty':'Please select a Payment Operator'}),
        transactionID:Joi.string().required().messages({'string.empty':'TransactionID is required'}),
        mobileNumber:Joi.required().messages({'string.empty':'Mobile Number is required'}),
        amount:Joi.required().messages({'string.empty':'Amount is required'})
    }).options({ stripUnknown: true });
    return schema.validate(transaction)
}

module.exports = AddWallet;
module.exports.validate = validateTransaction;