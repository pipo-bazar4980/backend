const { Schema, model } = require('mongoose');

module.exports.AdminNotification = model('AdminNotification', Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    notifications: [
        {
            type: String,
            default: []
        }
    ],
    view: {
        type: Boolean,
        default: false
    },
}, { timestamps: true }));


