
const _ = require('lodash');
const { Purchase, InGameValidate, IdCodeValidate } = require('../models/Purchase');

module.exports.createNewPurchase = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    if (req.body.idCodeActive === true) {
        const { error } = IdCodeValidate(req.body);
        if (error) return res.status(400).send(error.details[0].message)
    }
    else {
        const { error } = InGameValidate(req.body);
        if (error) return res.status(400).send(error.details[0].message)
    }

    const { product } = req.body

    const purchase = new Purchase(_.pick(req.body, ['productId', 'accountType', 'Number', 'Password', 'backupCode', "idCode", 'isComplete']));
    purchase.userId = req.user._id;
    purchase.product.option = Object.keys(product)[0],
        purchase.product.price = Object.values(product)[0]

    const result = await purchase.save();

    return res.status(201).send({
        purchase: _.pick(result, ['_id', 'userId', 'productId', 'accountType', 'Number', 'Password', 'backupCode', 'product', 'isComplete'])
    })
}

module.exports.getAllPurchaseById = async (req, res) => {
    const userId = req.params.id;
    const purchase = await Purchase.find({ userId: userId })
        .populate('productId', 'gameName');
    if (!purchase) res.status(404).send("Not Found any purchase!");
    return res.status(200).send(purchase)
}

module.exports.getAllPurchase = async (req, res) => {
    const purchase = await Purchase.find()
        .populate('productId', 'gameName');
    if (!purchase) res.status(404).send("No purchase available!");
    return res.status(200).send(purchase)
}