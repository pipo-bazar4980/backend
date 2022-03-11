const _ = require('lodash');
const Wallet = require('../models/Wallet');
const User = require('../models/Auth');
const { Order } = require('../models/Order');
const { Notification } = require('../models/Notifictions');

module.exports.createWallet = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    const wallet = new Wallet(_.pick(req.body, ['totalAmount', 'spentAmount', 'currentAmount', 'totalOrder']));
    wallet.userId = req.body.userId;
    const result = await wallet.save();

    await User.updateOne({ _id: req.body.userId }, { wallet: result._id });

    return res.status(201).send({
        wallet: _.pick(result, ['_id', 'userId', 'totalAmount', 'spentAmount', 'currentAmount', 'totalOrder'])
    })
}


exports.getWalletById = async (req, res) => {
    const id = req.params.id
    if (id) {
        Wallet.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found food with id " + id })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + id })
            })
    }
}

exports.getAllWallet = async (req, res) => {
    Wallet.find()
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found food with id " + id })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving user with id " + id })
        })
}



module.exports.updateWallet = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    const _id = req.params.id;
    const wallet = await Wallet.findById(_id)
    console.log(wallet)

    const { amount, spent } = req.body;

    const spentAmount = wallet.spentAmount + spent;
    const totalAmount = wallet.totalAmount + amount;
    const currentAmount = totalAmount - spentAmount;

    await Wallet.updateOne({ _id: _id }, { totalAmount, currentAmount, spentAmount });


    if (spentAmount >= 10000) {
        await User.updateOne({ _id: wallet.userId }, { vipBatch: true });

        let notification = await Notification.findOne({ userId: wallet.userId });
        let notifications = 'Congratulations! You have got VIP Batch for shopping over 1000 Taka'
        if (notification) {
            let array = [];
            array = notification.notifications;
            array.unshift(notifications)
            notifications = array
            await Notification.updateOne({ userId: userId }, { notifications })
        } else {
            notification = new Notification({
                userId,
                notifications
            });
            await notification.save();
        }
    }


    return res.status(200).send("Wallet updated!!");
}


module.exports.editBalance = async (req, res) => {
    const _id = req.params.id;
    const wallet = await Wallet.findById(_id)
    const { amount } = req.body;
    const totalAmount = wallet.spentAmount + amount;
    await Wallet.updateOne({ _id: _id }, { currentAmount: amount, totalAmount: totalAmount });
    return res.status(200).send("Amount updated!!");
}


module.exports.addSpentAmount = async (req, res) => {
    const _id = req.params.id;
    const wallet = await Wallet.find({ userId: _id })
    const { amount } = req.body;
    const spentAmount = wallet[0].spentAmount - amount
    const currentAmount = wallet[0].totalAmount - spentAmount;
    await Wallet.updateOne({ _id: wallet[0]._id }, { currentAmount: currentAmount, spentAmount: spentAmount });

    return res.status(200).send("Amount updated!!");
}




module.exports.removeSpentAmount = async (req, res) => {
    const _id = req.params.id;
    const wallet = await Wallet.find({ userId: _id })
    const { amount } = req.body;

    const spentAmount = wallet[0].spentAmount + amount
    const currentAmount = wallet[0].totalAmount - spentAmount;
    
    await Wallet.updateOne({ userId: _id }, { currentAmount: currentAmount, spentAmount: spentAmount });

    return res.status(200).send("Amount updated!!");
}
    



module.exports.deleteWallet = async (req, res) => {
    const _id = req.params.id;
    
    await Wallet.deleteOne({ _id: _id });
    return res.status(200).send("Deleted!");
}


