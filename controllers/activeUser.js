const ActiveUser = require('../models/ActiveUsers')


exports.activeUser = async (req, res) => {
    const userId = req.params.id;
    notification = new ActiveUser({
        activeUsers:userId
    });
    await notification.save();
};