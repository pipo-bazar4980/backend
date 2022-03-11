const Banners = require('../models/Banner')
const ErrorResponse = require("../utils/errorResponse")
const Products = require("../models/Products");
const _ = require('lodash');

//create new product Item

module.exports.createBanner = async (req, res) => {
    const { firstTitle, secondTitle, link } = req.body;

    if (req.file) {
        const banner = new Banners({
            image: `media/img/${req.file.filename}`,
            firstTitle,
            secondTitle, link
        })
        banner.save()
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
        return res.status(400).send('Please upload a image!')
    }

}



// retrieve and return all product Item
exports.findOneBanner = (req, res) => {
    const bannerId = req.params._id
    if (bannerId) {
        Products.findById(bannerId)
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
exports.findAllBanner = (req, res) => {
    Banners.find()
        .sort({ createdAt: -1 })
        .then(menu => {
            res.send(menu)
        }).catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retrieving user information" })
        })
}

// Update a food item by product id
exports.updateBanner = async (req, res) => {
    if (!req.body && !req.file) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.params._id;


    const banner = await Banners.findById(id);

    const updatedFields = _.pick(req.body, ['firstTitle', 'secondTitle', 'link']);
    _.assignIn(banner, updatedFields);

    if (req.file) {
        banner.image = `media/img/${req.file.filename}`
        banner.save()
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
        banner.save()
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
exports.removeBanner = async (req, res) => {
    const productId = req.params._id

    await Banners.deleteOne({ _id: productId });
    return res.status(200).send("Deleted!");

}