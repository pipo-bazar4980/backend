const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
        userId: {
            type: String,
        },

        rating: {
            type: String,
        },
        productId: {
            type: String
        }
    },
    {
        timestamps: true
    })

const AdminRatings = mongoose.model("AdminRating", ProductsSchema)

module.exports = AdminRatings
