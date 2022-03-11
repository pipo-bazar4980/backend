const { Order } = require("../models/Order");
const User = require('../models/Auth')
const ActiveUser = require('../models/ActiveUsers')
const { Notification } = require('../models/Notifictions');
const Products = require('../models/Products')
const { Purchase } = require('../models/Purchase');

exports.orderQueue = async (req, res, next) => {

    let order = await Order.find({ "handOver": "false" })

    let activeAdminList = await ActiveUser.find()
    let activeAdmin = activeAdminList[0].activeUsers;

    const handleOrder = []

    for (let i = 0; i < order.length; i++) {
        for (let j = 0; j < activeAdmin.length; j++) {
            let admin = await User.findById({ _id: activeAdmin[j] })
            for (let k = 0; k < admin.productList?.length; k++) {
                if (order[i].handOver === false) {
                    if (order[i].productId.equals(admin.productList[k])) {
                        handleOrder.push({
                            'admin': admin.username,
                            'orderId': order[i]._id,
                            'productId': order[i].productId
                        })
                        await Order.updateOne({ _id: order[i]._id }, { handOver: true, handOverAdmin: admin._id })
                        const orderInfo = await Order.findById(order[i]._id)
                        order = await Order.find()
                        order.push(order)

                        if (activeAdmin.length > 1) {
                            const adminId = admin;
                            activeAdmin.splice(j, 1)
                            await ActiveUser.updateOne(
                                { _id: "61d6cc7e2ac55c981f689a06" },
                                { $pull: { 'activeUsers': admin._id } }
                            );

                            activeAdmin.push(adminId)

                            await ActiveUser.updateOne(
                                { _id: "61d6cc7e2ac55c981f689a06" },
                                { $push: { 'activeUsers': admin._id } }
                            );
                        }

                        //Notifications
                        const productInfo = await Products.findById(orderInfo.productId)
                        const purchaseInfo = await Purchase.findById(orderInfo.purchaseId)

                        let notification = await Notification.findOne({ userId: admin._id });

                        
                        let notifications = `You have a new Order on ${productInfo.gameName}${productInfo.categoryName}. Purchase Package ${purchaseInfo.product.option} (${purchaseInfo.product.price})`

                        if (notification) {
                            let array = [];
                            array = notification.notifications;
                            array.unshift(notifications)
                            notifications = array
                            await Notification.updateOne({ userId: admin._id }, { notifications,view: false })
                        } else {
                            notification = new Notification({
                                userId: admin._id,
                                notifications: notifications
                            });
                            await notification.save();
                        }

                    }
                }
            }
        }
    }

    console.log('handleOrder', handleOrder)

}


