const { Schema, model } = require('mongoose');

module.exports.Support = model('Support', Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ]
    },
    phone: {
        type: String,
        required: true,
    },
    requestType: {
        type: String,
        required: true,
    },
    requestDescription: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    }

}, { timestamps: true }));

