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

const Ratings = mongoose.model("Rating", ProductsSchema)

module.exports = Ratings
