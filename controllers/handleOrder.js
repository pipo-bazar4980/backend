const ErrorResponse = require("../utils/errorResponse")
const User = require("../models/Auth");
const {Order} = require("../models/Order");
const Products = require("../models/Products");

const orderQueue = require('./')
const adminQueue = require('./')


const orderQueue = [
    {
        productId : "619d891e093e766d4a2255b9",
        orderId : "61a00fd3b162636c914dfdf1"
    },
    {
        productId : "61a00fd3b162636c914dfdf1",
        orderId : "61a00fd3b162636c914dfdf1"

    }]
const adminQueue = [{
    adminId : "",
    product :  [
        {
            productId : ""
        }
    ]
}]

const Wallet = require("../models/Wallet");
const {Purchase} = require("../models/Purchase");

const productQueue = [];
async function createProductQueue(allProduct) {

    for (let i = 0; i < allProduct.length; i++) {
        productQueue[i] = []
    }
    for (let j = 0; j < orderQueue.length; j++) {
        for (let i = 0; i < allProduct.length; i++) {
            if (orderQueue) {
                //console.log(orderQueue[j])
                if (allProduct[i]._id === orderQueue[j].productId) {
                    productQueue[i].push(orderQueue[j].productId)
                    orderQueue.shift()
                }
            }
        }
    }
    console.log(productQueue)
}

function getAdmin(orderQueue) {
    if (adminQueue){
        for(let i = 0; i < adminQueue.length; i++){
            for(let j=0; j<orderQueue.length; j++){
                for(let k=0; k<adminQueue[i].product.length; k++){
                    if(adminQueue[i].product[k]._id===orderQueue[j].productId){
                        if(adminQueue[i].isActive){
                            return(orderQueue[j])
                            const admin = adminQueue[i]
                            adminQueue.shift()
                            adminQueue.push(admin)
                        }
                    }
                }
            }
        }
    }
}

exports.getOneOrder = async (req, res, next) => {
    let allProduct
    Products.find()
        .then(menu => {
            allProduct = menu
            createProductQueue(allProduct)
            // console.log(allProduct)
        }).catch(err => {
        res.status(500).send({message: err.message || "Error Occurred while retrieving user information"})
    })


    for (let i=0; i<productQueue.length; i++){
         if (orderQueue){
            const admin =  getAdmin(orderQueue)
             res.send(admin)
         }
    }
}
