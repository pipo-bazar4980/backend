const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
        image: {
            type: String,
        },
        firstTitle: {
            type: String,
        },
        secondTitle : {
            type: String,
        },
        link : {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps : true
    })

const Banners = mongoose.model("Banners", ProductsSchema)

module.exports=Banners
