const { Notification } = require('../models/Notifictions');

exports.createNotifications = async (req, res) => {
    const userId = req.params.id;
    let { notifications } = req.body
    
    let notification = await Notification.findOne({ userId: userId });

    if (notification) {
        let array = [];
        array = notification.notifications;
        array.unshift(notifications)
        notifications = array
        await Notification.updateOne({ userId: userId }, { notifications:notifications, view: false })
    } else {
        notification = new Notification({
            userId,
            notifications
        });
        await notification.save();
    }
    return res.status(200).send("Notification added!");
}

exports.getNotifications = async (req, res) => {
    const userId = req.params.id;
    const notifications = await Notification.find({ userId: userId })
    return res.status(200).send(notifications);
}

exports.editNotifications = async (req, res) => {
    const userId = req.params.id;
    const notifications = await Notification.find({ userId: userId })
    await Notification.updateOne({ userId: userId }, { view: true })
    return res.status(200).send("Updated");
}