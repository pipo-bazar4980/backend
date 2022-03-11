const Products = require("../models/Products");
exports.findProducts = (req, res) => {
    const {search} = req.query.search
    
    // Products.find()
    //     .then(menu => {
    //         res.send(menu)
    //     }).catch(err => {
    //     res.status(500).send({ message: err.message || "Error Occurred while retrieving user information" })
    // })
    Products.find({ $text: { $search: `${search}` }
    })


    Products.createIndexes({subject: 'text'})   .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({message: err.message || "Error Occurred while retrieving user information"})
    })
}