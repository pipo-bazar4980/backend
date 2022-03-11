const { Schema, model } = require('mongoose');
const Joi = require('joi');

module.exports.Purchase = model('Purchase', Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    accountType: {
        type: String,
    },
    Number: {
        type: String,
    },
    Password: {
        type: String,
    },
    backupCode: {
        type: String,
    },
    idCode: {
        type: String
    },

    product: {

        option: {
            type: String,
        },
        price: {
            type: Number,
        }
    },

    isComplete: {
        type: Boolean,
        default: false
    },
    reject: {
        type: Boolean,
        default: false
    },
}, { timestamps: true }));


const validateInGame = inGame => {
    const schema = Joi.object({
        accountType: Joi.string().required(),
        Number: Joi.string().required(),
        Password: Joi.string().required(),
        backupCode: Joi.string().required()
    }).options({ stripUnknown: true });
    return schema.validate(inGame)
}

const validateIdCode = idCode => {
    const schema = Joi.object({
        idCode: Joi.string().required(),
    }).options({ stripUnknown: true });
    return schema.validate(idCode)
}

module.exports.InGameValidate = validateInGame;
module.exports.IdCodeValidate = validateIdCode;