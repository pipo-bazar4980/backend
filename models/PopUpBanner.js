const mongoose = require('mongoose')

const PopUpSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Please upload a image'],
    },
    activeStatus: {
        type: String,
        default: 'inActive'
    },
    text: {
        type: String
    },
    link: {
        type: String
    },
},
    {
        timestamps: true

    })

const PopUpBanner = mongoose.model("PopUpBanner", PopUpSchema)


module.exports = PopUpBanner

