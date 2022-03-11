const { Schema, model } = require('mongoose');

module.exports.Notification = model('Notification', Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    notifications: [
        {
            type: String,
        }
    ],
    view: {
        type: Boolean,
        default: false
    },
}, { timestamps: true }));


