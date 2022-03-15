const _ = require('lodash');
const { Order } = require('../models/Order');
const User = require('../models/Auth');
const moment = require('moment')


module.exports.oneDayOrder = async (req, res) => {
    const orders = await Order.find()
    let totalOrdersToday = 0;
    let totalOrdersMonthly = 0;
    let totalOrdersYearly = 0;

    let orderYear, orderMonth, orderDay;

    var date = new Date();
    const year = parseInt(moment(date).format('YYYY'))
    const month = parseInt(moment(date).format('M'))
    const day = parseInt(moment(date).format('D'))

    for (var i = 0; i < orders.length; i++) {

        orderYear = parseInt(moment(orders[i].createdAt).format('YYYY'));
        orderMonth = parseInt(moment(orders[i].createdAt).format('M'));
        orderDay = parseInt(moment(orders[i].createdAt).format('D'));

        if (orderYear === year && orderMonth === month && orderDay === day) {
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
    const allAdmin = await User.find({ role: "admin" })
    let orders = await Order.find({ paymentComplete: true })
    
    let totalOrder = 0, todayOrder = 0,array=[];

    var date = new Date();
    const year = parseInt(moment(date).format('YYYY'))
    const month = parseInt(moment(date).format('M'))
    const day = parseInt(moment(date).format('D'))


    for (const admin of allAdmin) {
        for (const item of orders) {

            if (await item?.handOverAdmin===admin._id) {

                totalOrder = totalOrder + 1
               
                let orderYear = parseInt(moment(item?.createdAt).format('YYYY'));
                let orderMonth = parseInt(moment(item?.createdAt).format('M'));
                let orderDay = parseInt(moment(item?.createdAt).format('D'));

                if (orderYear === year && orderMonth === month && orderDay === day) {
                    todayOrder = todayOrder + 1
                }
            }
        }
        array.push({
            admin:admin.username,
            today:todayOrder,
            total:totalOrder
        })
        
    }

    return res.status(200).send(array)
}

