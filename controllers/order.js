const _ = require('lodash');
const { Order } = require('../models/Order');
const Wallet = require('../models/Wallet');
const { orderQueue } = require('../controllers/orderQueue')
const Products = require('../models/Products')
const { Purchase } = require('../models/Purchase');
const { Notification } = require('../models/Notifictions');
const  moment = require('moment-timezone');

module.exports.createNewOrder = async (req, res) => {
    const orderCount = await Order.find()
    const orderLength = orderCount.length;

    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    const { userId } = req.body
    const order = new Order(_.pick(req.body, ['userId', 'walletId', 'purchaseId', 'productId', 'rechargeId', 'paymentComplete']));
    order.orderId = 1001 + orderLength
    order.orderCreationTime=moment().tz('Asia/Dhaka').unix() * 1000;
    const result = await order.save();

    orderQueue()

    return res.status(201).send({
        order: _.pick(result, ['userId', 'walletId', 'purchaseId', 'productId', 'rechargeId', 'paymentComplete'])
    })
}


module.exports.getOrders = async (req, res) => {
    const order = await Order.find()
        .sort({ createdAt: -1 })
        .populate('productId', ['gameName', 'categoryName',])
        .populate('userId', ['username', 'phonenumber', 'userIdNo'])
        .populate('purchaseId', ['product'])
        .populate('walletId', 'currentAmount')
        .populate('rechargeId', 'transactionID')
        .populate('handOverAdmin', 'username')
    if (!order) res.status(404).send("You have no order!");
    return res.status(200).send(order)
}


module.exports.getOrdersByAdminId = async (req, res) => {
    const adminId = req.params.id;
    const order = await Order.find({ handOverAdmin: adminId })
        .sort({ createdAt: -1 })
        .populate('productId', ['gameName', 'categoryName',])
        .populate('userId', ['username', 'phonenumber', 'userIdNo'])
        .populate('purchaseId', ['product', 'accountType', 'Number', 'Password', 'backupCode', 'idCode'])
        .populate('walletId', 'currentAmount')
        .populate('rechargeId', 'transactionID')
    if (!order) res.status(404).send("You have no order!");
    return res.status(200).send(order)
}

module.exports.getOrdersById = async (req, res) => {
    const userId = req.params.id;
    const order = await Order.find({ userId: userId })
        .sort({ createdAt: -1 })
        .populate('userId', ['username', 'phonenumber', 'userIdNo'])
        .populate('productId', ['gameName', 'categoryName'])
        .populate('purchaseId', 'product')
    if (!order) res.status(404).send("You have no order!");
    return res.status(200).send(order)
}

module.exports.updateOrderStatus = async (req, res) => {
    const orderId = req.params.id;
    let findOrder=await Order.findById(orderId)

    console.log("moment().tz('Asia/Dhaka').unix() * 1000",moment().tz('Asia/Dhaka').unix() * 100)
    if (req.body.isComplete===true) {
        if(findOrder.isComplete===false){
            const { isComplete, paymentComplete } = req.body;
            await Order.updateOne({ _id: orderId }, { isComplete: isComplete, paymentComplete: paymentComplete,orderConfirmationTime:moment().tz('Asia/Dhaka').unix() * 1000 });

            let userId = req.body.userId
            const findWallet = await Wallet.find({ userId: userId })
            await Wallet.updateOne({ userId: userId }, { totalOrder: findWallet[0].totalOrder + 1 })
        }
        else{
            return res.send('marked')
        }

    }
    if (req.body.reject===true) {
        if(findOrder.reject===false){
            const { reject } = req.body;
            await Order.updateOne({ _id: orderId }, { reject: reject, rejectReason: req.body.message });
        }
        else{
            return res.send('marked')
        }

    }
    if (req.body.reject === false) {
        if(findOrder.reject===true){
            await Order.updateOne({ _id: orderId }, { reject: false, rejectReason: req.body.rejectReason });
        }
        else{
            return res.send('marked')
        }
    }

    return res.status(200).send("Active Status updated!!");
}

module.exports.markAllComplete = async (req, res) => {
    const order = await Order.find();
    for (let i = 0; i < req.body.length; i++) {
        for (let j = 0; j < order.length; j++) {
            if (order[j]._id.equals(req.body[i])) {
                await Order.updateOne({ _id: order[j]._id }, { isComplete: true,orderConfirmationTime:moment().tz('Asia/Dhaka').unix() * 1000 });
                const findWallet = await Wallet.find({ userId: order[j].userId })
                await Wallet.updateOne({ userId: order[j].userId }, { totalOrder: findWallet[0].totalOrder + 1 })

                //notification
                const product = await Products.find({ _id: order[j].productId });
                let gameName = product[0].gameName
                const purchase = await Purchase.find({ _id: order[j].purchaseId });
                let option = purchase[0].product.option
                let spent = purchase[0].product.price
                let notifications = `Your order has been confirmed for ${gameName}. Purchase Package: ${option} ${spent} Taka. `

                let notification = await Notification.findOne({ userId: order[j].userId });

                if (notification) {
                    let array = [];
                    array = notification.notifications;
                    array.unshift(notifications)
                    notifications = array
                    await Notification.updateOne({ userId: order[j].userId }, { notifications: notifications, view: false })
                } else {
                    notification = new Notification({
                        userId:order[j].userId,
                        notifications
                    });
                    await notification.save();
                }
            }
        }
    }

    return res.status(200).send("Mark All completed!")

}