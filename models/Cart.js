// const { Schema } = require('mongoose');
const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    price: Number,
    count: {
        type: Number,
        default: 1,
        min: 1,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

const Products = mongoose.model("CartItem", CartItemSchema)
module.exports=Products
