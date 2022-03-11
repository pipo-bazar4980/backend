const mongoose = require('mongoose');
const Joi = require('joi');

const ProductsSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: [true, 'Please provide a product Name'],
    },
    categoryName: {
        type: String,
        required: [true, 'Please provide a product Name'],
    },
    backUpLink: {
        type: String,
    },
    images: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    // rating: [{
    //     hasRated: {
    //         type: Boolean,
    //         default:false
    //     },
    //     peoplesId: {
    //         type: Number,
    //     },
    //     rating:{
    //         type: Number
    //     },
    // }],
    // isModified: {
    //     type: Boolean,
    //     default: false
    // },
    // modifiedRating: {
    //     type: Number
    // },
    topUp: [
        {
            option: {
                type: String,
                required: [true, 'Please provide a name']
            },
            price: {
                type: Number,
                required: [true, 'Please provide a price']
            },
            stock : {
                type : Boolean,
                default : true
            }
        }
    ],
},

    {
        timestamps: true
    })

const Products = mongoose.model("Products", ProductsSchema)

const validateProduct = product => {
    const schema = Joi.object({
        gameName: Joi.string().required().messages({ 'string.empty': 'Game name is required' }),
        categoryName: Joi.string().required().messages({ 'string.empty': 'Category name is required' }),
        backUpLink: Joi.string().required().messages({ 'string.empty': 'Backup link is required' }),
    }).options({ stripUnknown: true });
    return schema.validate(product)
}

module.exports = Products
module.exports.validate = validateProduct;