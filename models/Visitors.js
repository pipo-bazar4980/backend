const { Schema, model } = require('mongoose')

const visitorsSchema = Schema({
    count: {
        type: Number,
        default:0,
    },
})

module.exports.Visitors=model('Visitors',visitorsSchema);
