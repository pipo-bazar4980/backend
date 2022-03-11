const { Visitors } = require('../models/Visitors')

exports.getVisitorsPerDay = async (req, res) => {
    
    const totalVisitors = await Visitors.find()
        .select({ count: 1 })
    return res.status(200).send(totalVisitors)
};

exports.increaseVisitors = async (req, res) => {
    const data = await Visitors.aggregate([
        {
            $group: {
                _id: "$count",
                total: { $sum: 1 },
            },
        },
    ]);
    const count=data[0]._id;
    await Visitors.updateOne({ count: count+1});
    return res.status(200).send("Visitors Increased!");
};

exports.create = async (req, res) => {
    const { count } = req.body;
    let visitors = new Visitors({ count: count });
    const result = await visitors.save();
    res.status(201).send(result);
};