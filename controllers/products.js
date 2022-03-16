const Products = require('../models/Products')
const ErrorResponse = require("../utils/errorResponse")
const _ = require('lodash');
const User = require('../models/Auth')
const { Order } = require('../models/Order');
var isodate = require("isodate");
const moment = require('moment')
const { validate } = require('../models/Products')
const { Purchase } = require('../models/Purchase');
//create new product Item

exports.create = (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    const { gameName, categoryName, backUpLink } = req.body;

    if (!req.body.topUp) {
        return res.status(500).send('Please add product package')
    }

    let product = new Products({
        gameName,
        categoryName,
        backUpLink,
        topUp: JSON.parse(req.body.topUp),

    })


    if (req.file) {
        product.images = `media/img/${req.file.filename}`
        product.save()
            .then(data => {
                res.status(200).send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating a create operation"
                });
            });
    } else {
        return res.status(500).send('Please upload an image')
    }

}


// retrieve and return all product Item
exports.findOne = (req, res) => {
    const productId = req.params._id
    if (productId) {
        Products.findById(productId)
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
// retrieve and return a single product item
exports.findAll = (req, res) => {
    Products.find({ disabled: false })
        .then(menu => {
            res.send(menu)
        }).catch(err => {
        res.status(500).send({ message: err.message || "Error Occurred while retrieving user information" })
    })
}


// Update product
exports.update = async (req, res) => {
    const productId = req.params.id
    const product = await Products.findById(productId);

    const updatedFields = _.pick(req.body, ['gameName', 'categoryName', 'backUpLink']);
    _.assignIn(product, updatedFields);

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

exports.updateImage = async (req, res) => {
    const productId = req.params.id
    const product = await Products.findById(productId);

    if (req.file) {
        product.images = `media/img/${req.file.filename}`
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
// Delete a food with specified product id in the request
exports.remove = (req, res) => {
    const productId = req.params._id
    Products.updateOne({ _id: productId }, { disabled: true })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${productId}. Maybe user not found!` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })
}


exports.filterProductByDate = async (req, res) => {

    const order = await Order.find({ isComplete: true })
    // console.log(order)
    console.log(req.body)

    let totalOrders = 0;
    let totalIncome = 0;

    let orderYear;
    let orderMonth;
    let orderDay;
    if (req.body.date) {
        const {date} = req.body;
        const year = parseInt(date.split("-")[0]);
        const month = parseInt(date.split("-")[1]);
        const day = parseInt(date.split("-")[2]);

        for (let i = 0; i < order.length; i++) {
            orderYear = parseInt(moment(order[i].createdAt).format('YYYY'));
            orderMonth = parseInt(moment(order[i].createdAt).format('M'));
            orderDay = parseInt(moment(order[i].createdAt).format('D'));


            if (year === orderYear && month === orderMonth && day === orderDay) {
                totalOrders = totalOrders + 1
                console.log(orderYear,orderDay, orderMonth)
                const purchase = await Purchase.findById({_id: order[i].purchaseId})
                totalIncome = totalIncome + purchase.product.price
            }
        }
    }


    const count = {
        totalOrders,
        totalIncome,
    }
    return res.status(200).send(count);
}


exports.filterAdminProduct = async (req, res) => {
    let i;
    let user = await User.findOne({ _id: req.params.id });
    let product = await Products.find({ disabled: false })

    let productArray = [];

    for (i = 0; i < product.length; i++) {
        productArray.push(product[i]._id)
    }

    let filteredData = productArray

    if (user.productList) {
        filteredData = productArray.filter(item => !user.productList.includes(item))
    }

    let data = []

    for (i = 0; i < filteredData.length; i++) {
        let productData = await Products.findOne({ _id: filteredData[i]._id })
        data.push(productData)
    }

    return res.status(200).send(data);
}


exports.deleteTopUp = async (req, res) => {
    const productId = req.params.id
    const product = await Products.findById(productId);

    if (product) {
        let topUpId = req.params.topUpId
        let index=null;
        let topUpArray = product.topUp;

        for (let i = 0; i < topUpArray.length; i++) {
            if (topUpArray[i]._id.equals(topUpId)) {
                index = i;
            }
        }

        if (index!=null) {
            topUpArray.splice(index, 1);
            await Products.updateOne({ _id: productId }, { topUp: topUpArray });
            const data = await Products.findById(productId)
            const update = data.topUp
            res.status(200).send(update)
        } else {
            res.status(200).send("No match found!")
        }

    } else {
        res.status(200).send("No match found!")
    }
}
exports.updateTopUp = async (req, res) => {
    const productId = req.params.id
    const product = await Products.findById(productId);

    if (product) {
        let { topUpId } = req.body
        let index=null;
        let topUpArray = product.topUp;
        for (let i = 0; i < topUpArray.length; i++) {
            if (topUpArray[i]._id.equals(topUpId)) {
                console.log(i)
                index = i;
            }
        }

        if (index!=null) {

            if (req.body.option) {
                topUpArray[index].option = req.body.option
            }
            if (req.body.price) {
                topUpArray[index].price = req.body.price
            }
            if (req.body) {
                topUpArray[index].stock = req.body.stock
            }
            //console.log(topUpArray)
            await Products.updateOne({ _id: productId }, { topUp: topUpArray });
            const data = await Products.findById(productId)
            const update = data.topUp
            res.status(200).send(update)
        } else {
            res.status(200).send("No match found!!")
        }

    } else {
        res.status(200).send("No match found!")
    }
}


exports.createTopUp = async (req, res) => {
    const productId = req.params.id
    const product = await Products.findById(productId);
    if (product) {
        let topUpArray = product.topUp;

        if (req.body.option && req.body.price) {
            const data = {
                "option": req.body.option,
                "price": req.body.price,
                "stock": req.body.stock
            }
            topUpArray.push(data)
            await Products.updateOne({ _id: productId }, { topUp: topUpArray });
            const d = await Products.findById(productId);
            const response = d.topUp
            res.status(200).send(response)
        } else {
            res.status(200).send("Both Option and price is required!")
        }
    } else {
        res.status(200).send("No match found!")
    }
}