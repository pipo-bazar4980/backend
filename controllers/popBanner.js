const PopUpBanner = require('../models/PopUpBanner')
const _ = require('lodash');

module.exports.createPopUpBanner = async (req, res) => {
    const { text,link } = req.body

    const popUpBanner = new PopUpBanner({
        image: `media/img/${req.file.filename}`,
        text,
        link
    })
    popUpBanner.save()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}

exports.findOnPopupBanner = (req, res) => {
    const productId = req.params._id
    if (productId) {
        PopUpBanner.findById(productId)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found food with id " + productId })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + productId })
            })
    }
}


exports.updatePopUpBanner = async (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const productId = req.params._id
    const product = await PopUpBanner.findById(productId);

    const updatedFields = _.pick(req.body, ['text','link','activeStatus']);
    _.assignIn(product, updatedFields);

    if (req.file) {
        product.image = `media/img/${req.file.filename}`
        product.save()
            .then(data => {
                res.status(200).send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating a create operation"
                });
            });
    }
    else {
        product.save()
            .then(data => {
                res.status(200).send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating a create operation"
                });
            });
    }
}

exports.deletePopUpBanner = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.params._id;
    PopUpBanner.deleteOne(id)
        .then(data => {
            res.status(201).send("deleted")
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })
}