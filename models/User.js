const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
        adminId : {
            type : String
        },
        selectedProducts :[
            {
                productId : {
                    type: String
                }
            }
        ]
    },
    {
        timestamps : true
    })

const AdminProductQueue = mongoose.model("AdminProductQueue", ProductsSchema)

module.exports=AdminProductQueue

