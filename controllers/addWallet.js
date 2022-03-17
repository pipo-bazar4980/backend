const AddWallet = require('../models/AddWallet')
const ErrorResponse = require("../utils/errorResponse")
const _ = require('lodash');
// const formidable = require('formidable');
const fs = require('fs');
const {createNotifications} = require("./notification");
const {validate} = require('../models/AddWallet')
const {Order} = require("../models/Order");
const Wallet = require("../models/Wallet");
const Products = require("../models/Products");
const {Purchase} = require("../models/Purchase");
const {Notification} = require("../models/Notifictions");

//create new product Item
exports.addWallet = async (req, res, next) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    // validate request
    if (!req.body) {
        res.status(400).send({message: "Content can not be emtpy!"});
        return;
    }

    const {walletId, paymentType, transactionID, mobileNumber, amount} = req.body;

    let transactionNumber = {};
    transactionNumber = await AddWallet.findOne({transactionID: transactionID})
    if (transactionNumber) return res.status(400).send('We have to enter a unique Transaction Number!')

    const addWallet = await AddWallet.find({walletId: walletId, isComplete: false, reject: false})

    if (addWallet.length !== 0) {
        return (res.status(400).send('We have one pending transaction! Please make a new transaction after your previous transaction is approved'))
    } else {
        // new wallet
        const walletDetails = new AddWallet({
            walletId,
            paymentType,
            transactionID,
            mobileNumber,
            amount
        })
        walletDetails.userId = req.user._id;

        // save product in the database
        walletDetails.save()
            .then(data => {
                //res.send(data)
                res.status(200).send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating a create operation"
                });
            });
    }
}

exports.findOneWallet = async (req, res) => {
    const id = req.params._id;
    if (id) {
        AddWallet.findById(id)
            .sort({createdAt: -1})
            .then(data => {
                if (!data) {
                    res.status(404).send({message: "Not found food with id " + userId})
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({message: "Error retrieving user with id " + userId})
            })
    }
}

exports.findTransactionById = async (req, res) => {
    const id = req.params._id;
    if (id) {
        AddWallet.find({userId: id})
            .sort({createdAt: -1})
            .then(data => {
                if (!data) {
                    res.status(404).send({message: "Not found food with id " + userId})
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({message: "Error retrieving user with id " + userId})
            })
    }
}


// retrieve and return a single product item
exports.findAllWallet = (req, res) => {
    AddWallet.find()
        .sort({createdAt: -1})
        .populate('userId', ['username', 'phonenumber', 'userIdNo'])
        .then(menu => {
            res.send(menu)
        }).catch(err => {
        res.status(500).send({message: err.message || "Error Occurred while retrieving user information"})
    })
}

// Update a food item by product id
exports.updateWallet = async (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({message: "Data to update can not be empty"})
    }
    const id = req.params._id;
    let findAddWallet = await AddWallet.findById(id)

    if (req.body.isComplete === true) {
        if (findAddWallet.isComplete === false) {
            const {isComplete} = req.body;
            await AddWallet.updateOne({_id: id}, {isComplete: isComplete})
                .then(data => {
                    if (!data) {
                        res.status(404).send({message: `Cannot Update user with ${id}. Maybe user not found!`})
                    } else {
                        res.send(data)
                    }
                })
                .catch(err => {
                    res.status(500).send({message: "Error Update user information"})
                })
        } else {
            return res.send('marked')
        }
    } else if (!req.body.isComplete === false) {
        if (findAddWallet.isComplete === true) {
            const {isComplete} = req.body;
            await AddWallet.updateOne({_id: id}, {isComplete: isComplete})
                .then(data => {
                    if (!data) {
                        res.status(404).send({message: `Cannot Update user with ${id}. Maybe user not found!`})
                    } else {
                        res.send(data)
                    }
                })
                .catch(err => {
                    res.status(500).send({message: "Error Update user information"})
                })
        } else {
            return res.send('marked')
        }
    } else if (req.body.reject === true) {
        if (findAddWallet.reject === false) {
            const {reject} = req.body;
            await AddWallet.updateOne({_id: id}, {reject: reject, rejectReason: req.body.message})
                .then(data => {
                    if (!data) {
                        res.status(404).send({message: `Cannot Update user with ${id}. Maybe user not found!`})
                    } else {
                        res.send(data)
                    }
                })
                .catch(err => {
                    res.status(500).send({message: "Error Update user information"})
                })
        } else {
            return res.send('marked')
        }
    } else if (req.body.reject === false) {
        if (findAddWallet.reject === true) {
            await AddWallet.updateOne({_id: id}, {reject: false, rejectReason: req.body.rejectReason})
                .then(data => {
                    if (!data) {
                        res.status(404).send({message: `Cannot Update user with ${id}. Maybe user not found!`})
                    } else {
                        res.send(data)
                    }
                })
                .catch(err => {
                    res.status(500).send({message: "Error Update user information"})
                })
        } else {
            return res.send('marked')
        }
    } else {
        console.log('console')
    }

}

// Delete a food with specified product id in the request
exports.removeWallet = (req, res) => {
    const productId = req.params._id

    //Products.findByIdAndDelete(productId)
    AddWallet.updateOne({_id: productId}, {disabled: true})
        .then(data => {
            if (!data) {
                res.status(404).send({message: `Cannot Delete with id ${productId}. Maybe id is wrong`})
            } else {
                res.send({
                    message: "Product was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + productId
            });
        });
}


module.exports.filterTransaction = async (req, res) => {
    let filters = req.body.filters;
    let args = {}

    for (let key in filters) {
        if (filters[key].length > 0) {
            if (key === 'paymentType')
                args['paymentType'] = {
                    $in: filters['paymentType']
                }
        }
    }

    const transactions = await AddWallet.find(args).populate('userId', 'userIdNo')
        .sort({createdAt: -1})

    return res.status(200).send(transactions);
}


module.exports.editBalance = async (req, res) => {
    const _id = req.params._id;
    const {amount} = req.body;
    await AddWallet.updateOne({_id: _id}, {amount: amount});
    return res.status(200).send("Amount updated!!");
}

module.exports.markAllPurchaseComplete = async (req, res) => {
    let queryArr = [{_id: {$in: req.body}}];
    await AddWallet.updateMany({$and: [...queryArr]}, {isComplete: true})
    let findTransactions = await AddWallet.find({$and: [...queryArr]}, {
        walletId: 1,
        amount: 1,
        userId: 1,
        transactionID: 1
    })

    for (let trans of findTransactions) {
        const wallet = await Wallet.findById({_id: trans.walletId})

        let currentAmount = wallet?.currentAmount + trans.amount
        let totalAmount = currentAmount + wallet.spentAmount;

        await Wallet.updateOne({_id: wallet._id}, {currentAmount, totalAmount});

        let notifications = `${trans.amount} Taka has been added to your wallet for TransactionId:${trans.transactionID}`

        let notification = await Notification.findOne({userId: trans.userId});

        if (notification) {
            let array = [];
            array = notification.notifications;
            array.unshift(notifications)
            notifications = array
            await Notification.updateOne({userId: trans.userId}, {notifications: notifications, view: false})
        } else {
            notification = new Notification({
                userId: trans.userId,
                notifications
            });
            await notification.save();
        }
    }
    return res.status(200).send("Mark All completed!")

}



