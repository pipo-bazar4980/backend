const _ = require('lodash');
const { Order } = require('../models/Order');
const { Purchase } = require('../models/Purchase');
const moment = require('moment')


module.exports.revenueCount = async (req, res) => {

    
    const orders = await Order.find({isComplete:true})
    let orderYear, orderMonth, orderDay;

    let totalOrdersToday = [];
    let totalOrdersMonthly = [];
    let totalOrdersYearly = [];
    let totalOrders=[];

    let totalRevenueToday = 0;
    let totalRevenueMonthly = 0;
    let totalRevenueYearly = 0;
    let totalRevenue=0;

    var date = new Date();
    const year = parseInt(moment(date).format('YYYY'))
    const month = parseInt(moment(date).format('M'))
    const day = parseInt(moment(date).format('D'))

    for (var i = 0; i < orders.length; i++) {
        orderYear = parseInt(moment(orders[i].createdAt).format('YYYY'));
        orderMonth = parseInt(moment(orders[i].createdAt).format('M'));
        orderDay = parseInt(moment(orders[i].createdAt).format('D'));

        if (orderYear === year && orderMonth === month && orderDay === day) {
            totalOrdersToday.push(orders[i])
        }

        if (orderYear === year && orderMonth === month) {
            totalOrdersMonthly.push(orders[i])
        }

        if (orderYear === year) {
            totalOrdersYearly.push(orders[i])
        }

        totalOrders.push(orders[i])
    }


    for (var i = 0; i < totalOrdersToday.length; i++) {
        const purchase = await Purchase.findById({ _id: totalOrdersToday[i].purchaseId })
        totalRevenueToday = totalRevenueToday + purchase.product.price
    }


    for (var i = 0; i < totalOrdersMonthly.length; i++) {
        const purchase = await Purchase.findById({ _id: totalOrdersMonthly[i].purchaseId })
        totalRevenueMonthly = totalRevenueMonthly + purchase.product.price
    }

    for (var i = 0; i < totalOrdersYearly.length; i++) {
        const purchase = await Purchase.findById({ _id: totalOrdersYearly[i].purchaseId })
        totalRevenueYearly = totalRevenueYearly + purchase.product.price
    }

    for (var i = 0; i < totalOrders.length; i++) {
        const purchase = await Purchase.findById({ _id: totalOrders[i].purchaseId })
        totalRevenue = totalRevenue + purchase.product.price
    }

    const revenue = {
        totalRevenue,
        totalRevenueToday,
        totalRevenueMonthly,
        totalRevenueYearly
    }

    return res.status(200).send(revenue)
}