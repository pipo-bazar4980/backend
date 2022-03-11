const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ActiveUsersSchema = new mongoose.Schema({
    activeUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Auth',
            required: true,
        },
    ]
},
    {
        timestamps: true
    })


const ActiveUsers = mongoose.model("ActiveUsers", ActiveUsersSchema)

module.exports = ActiveUsers