const _ = require('lodash');
const { Support } = require('../models/Support');
const Methods = require("../models/paymentMethod");

module.exports.createSupport = async (req, res) => {
    const userId = req.params.id;
    
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    const support = new Support(_.pick(req.body, ['name', 'email', 'phone', 'requestType', 'requestDescription']));
    support.userId = userId;
    const result = await support.save();

    return res.status(201).send({
        support: _.pick(result, ['userId', 'name', 'email', 'phone', 'requestType', 'requestDescription'])
    })
}


module.exports.getSupportMessage = async (req, res) => {
    Support.find()
        .sort({ createdAt: -1 })
        .then(menu => {
            res.send(menu)
        }).catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retrieving user information" })
        })


}

module.exports.removeMethod = async (req, res) => {
    const productId = req.params._id

    await Support.updateOne({ _id: productId }, { active: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Delete with id ${productId}. Maybe id is wrong` })

            } else {
                res.send({
                    message: "Banner was deleted successfully!"
                })
                
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + productId
            });
        });
}



exports.markSupport = async (req, res) => {
    const userId = req.params.id;
    await Support.updateOne({ _id: userId }, { active: false });
    return res.status(200).send("Support Updated!!");
};