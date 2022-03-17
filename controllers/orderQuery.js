const _ = require('lodash');
const {Order} = require('../models/Order');
const User = require('../models/Auth');
const moment = require('moment-timezone');


module.exports.oneDayOrder = async (req, res) => {
    const orders = await Order.find({isComplete: true},{createdAt:1,orderCreationTime:1})
    let totalOrdersToday = 0;
    let totalOrdersMonthly = 0;
    let totalOrdersYearly = 0;

    let orderYear, orderMonth, orderDay;
    let todayTimeStart = moment().startOf('day').toDate().getTime()
    let todayTimeEnd = moment().endOf('day').toDate().getTime()


    const year = parseInt(moment().format('YYYY'))
    const month = parseInt(moment().format('M'))
    const day = parseInt(moment().format('D'))


    for (var i = 0; i < orders.length; i++) {

        orderYear = parseInt(moment(orders[i].createdAt).format('YYYY'));
        orderMonth = parseInt(moment(orders[i].createdAt).format('M'));
        orderDay = parseInt(moment(orders[i].createdAt).format('D'));


        if (await orders[i]?.orderCreationTime >= todayTimeStart && orders[i]?.orderCreationTime <= todayTimeEnd) {
            totalOrdersToday = totalOrdersToday + 1
        }

        if (orderYear === year && orderMonth === month) {
            totalOrdersMonthly = totalOrdersMonthly + 1
        }
        if (orderYear === year) {
            totalOrdersYearly = totalOrdersYearly + 1
        }
    }
    const count = {
        totalOrdersToday,
        totalOrdersMonthly,
        totalOrdersYearly
    }
    return res.status(200).send(count)
}


module.exports.adminOrderQuery = async (req, res) => {
    const allAdmin = await User.find({
        $or: [
            {
                role: "admin"
            },
            {
                role: "superadmin"
            }
        ]
    },{_id:1,username:1})

    let todayTimeStart = moment().startOf('day').toDate().getTime()
    let todayTimeEnd = moment().endOf('day').toDate().getTime()
    let array = []
    let orders = await Order.find({isComplete: true}, {handOverAdmin: 1, orderConfirmationTime: 1});

    for (const admin of allAdmin) {
        let totalOrder = 0
        let todayOrder = 0
        for (const item of orders) {

            if (await item?.handOverAdmin?.equals(admin._id)) {
                totalOrder = totalOrder + 1

                if (await item?.orderConfirmationTime >= todayTimeStart && item?.orderConfirmationTime <= todayTimeEnd) {
                    todayOrder = todayOrder + 1
                }
            }
        }
        array.push({
            admin: admin.username,
            today: todayOrder,
            total: totalOrder
        })

    }

    return res.status(200).send(array)
}

