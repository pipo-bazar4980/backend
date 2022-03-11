const Methods = require('../models/paymentMethod')
const ErrorResponse = require("../utils/errorResponse")
const { validate } = require('../models/paymentMethod')
const _ = require('lodash');

//create new product Item

module.exports.createMethod = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const { name, number } = req.body;
    const banner = new Methods({
        name, number
    })
    if (req.file) {
        banner.image = `media/img/${req.file.filename}`
        banner.save()
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
    else {
        return res.status(500).send('Please upload an image')
    }

}



// retrieve and return all product Item
exports.findOneMethod = (req, res) => {
    const bannerId = req.params._id
    if (bannerId) {
        Methods.findById(bannerId)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found food with id " + bannerId })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + bannerId })
            })
    }
}
// retrieve and return a single product item
exports.findAllMethod = (req, res) => {
    Methods.find()
        .then(menu => {
            res.send(menu)
        }).catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retrieving user information" })
        })
}

// Update a food item by product id
exports.updateMethod = async (req, res) => {
    if (!req.body && !req.file) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.params._id;
    const method = await Methods.findById(id);

    const updatedFields = _.pick(req.body, ['name', 'number']);
    _.assignIn(method, updatedFields);

    if (req.file) {
        method.image = `media/img/${req.file.filename}`
        method.save()
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
        method.save()
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

// Delete a food with specified product id in the request
exports.removeMethod = async (req, res) => {
    const productId = req.params._id

    await Methods.deleteOne({ _id: productId });
    return res.status(200).send("Deleted!");

}