const { AdminNotification } = require('../models/adminNotifictions');

exports.createAdminNotifications = async (req, res) => {
    const userId = req.params.id;
    let { notifications } = req.body

    let notification = await AdminNotification.findOne({ userId: userId });

    if (notification) {
        let array = [];
        array = notification.notifications;
        array.unshift(notifications)
        notifications = array
        await AdminNotification.updateOne({ userId: userId }, { notifications })
    } else {
        notification = new AdminNotification({
            userId,
            notifications
        });
        await notification.save();
    }
    return res.status(200).send("Notification added!");
}

exports.getAdminNotifications = async (req, res) => {
    const userId = req.params.id;
    const notifications = await AdminNotification.find({ userId: userId })
    return res.status(200).send(notifications);
}



exports.editAdminNotifications = async (req, res) => {
    const userId = req.params.id;
    const notifications = await AdminNotification.find({ userId: userId })
    await AdminNotification.updateOne({ userId: userId }, { view: true })
    return res.status(200).send("Updated!");
}