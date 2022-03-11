const mongoose = require('mongoose')
const Joi = require('joi');

const ProductsSchema = new mongoose.Schema({
        image: {
            type: String,
            required: [true, 'Please upload a image'],
        },
        name: {
            type: String,
        },
        number: {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    })



const Methods = mongoose.model("Methods", ProductsSchema)


const validateMethod = method => {
    const schema = Joi.object({
        name: Joi.string().required().messages({ 'string.empty': 'Payment Method name is required' }),
        number: Joi.string().required().messages({ 'string.empty': 'Number is required' }),
    }).options({ stripUnknown: true });
    return schema.validate(method)
}

module.exports = Methods
module.exports.validate = validateMethod;