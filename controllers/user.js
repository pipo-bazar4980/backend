const User = require('../models/Auth')
const verify = require("../middleware/verifyToken");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");
const AdminProductQueue = require("../models/User");
const ActiveUser = require('../models/ActiveUsers');
const Wallet = require('../models/Wallet');
const {orderQueue} = require('../controllers/orderQueue')
const _ = require('lodash');

exports.updatePassword = async (req, res) => {

    let {newPassword, email} = req.body;
    let user = await User.findOne({email: email})
    if (user) {
        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash(newPassword, salt);
        await User.updateOne({email: email}, {password: newPassword});
        res.status(200).send("password updated!");
    }
}


exports.updatePhoneVerify = async (req, res) => {
    //console.log(req.body)
    let users = await User.findOne({email: req.body.email})
    if (users) {
        if (users.phonenumber === req.body.phonenumber) {
            const data = {
                phoneNumberVerify: req.body.phoneNumberVerify
            }
            let updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: data,
                    //profilePic: `media/img/${req.file.filename}`
                },
                {new: true}
            );
            res.status(200).json(updatedUser);
        }
    }
}

exports.updateUser = async (req, res) => {
    console.log(req.body)
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    let users = await User.findOne({email: req.body.email})
    if (users) return res.status(400).send('This email already exists!')

    let userPhone = await User.findOne({phonenumber: req.body.phonenumber})

    if (userPhone) return res.status(400).send('Someone is using this phone number. Try a new one.')

    if (req.file) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                    profilePic: `media/img/${req.file.filename}`
                },
                {new: true}
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                    //profilePic: `media/img/${req.file.filename}`
                },
                {new: true}
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}


exports.deleteUser = async (req, res) => {

    const _id = req.params.id;
    await User.updateOne({_id: _id}, {disabled: true});
    return res.status(200).send("Deleted!");
};

//GET

exports.getOneUser = async (req, res) => {
    const id = req.params.id
    if (id) {
        User.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({message: "Not found food with id " + id})
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({message: "Error retrieving user with id " + id})
            })
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find()
            .populate('wallet', ['currentAmount'])
        return res.status(201).send(users);
    } catch (err) {
        res.status(500).json(err);
    }
}


//GET USER STATS
exports.getUserStats = async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);

    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1},
                },
            },
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateUserRole = async (req, res) => {
    const _id = req.params.id;
    const {role} = req.body;
    await User.updateOne({_id: _id}, {role: role});
    return res.status(200).send("Role updated!!");
}

exports.updateUserWallet = async (req, res) => {
    const _id = req.params.id;
    const {wallet} = req.body;
    await User.updateOne({_id: _id}, {wallet: wallet});
    return res.status(200).send("wallet updated!!");
}

exports.updateUserActiveStatus = async (req, res) => {
    const userId = req.params.id;
    const {activeStatus} = req.body;
    await User.updateOne({_id: userId}, {activeStatus: activeStatus});
    let user;

    if (activeStatus === 'active') {
        let users = await ActiveUser.find();
        let array = [];

        for (var i = 0; i < users.length; i++) {
            array = users[i].activeUsers
        }
        array.push(userId)

        user = await ActiveUser.updateOne(
            {_id: "61d6cc7e2ac55c981f689a06"},
            {activeUsers: array},
        );

        await orderQueue();
    } else {
        user = await ActiveUser.updateOne(
            {_id: "61d6cc7e2ac55c981f689a06"},
            {$pull: {'activeUsers': userId}}
        );
    }

    return res.status(200).send(user);
}

exports.addProduct = async (req, res) => {
    let {productList} = req.body
    productList = productList[0].productList;

    let user = await User.findOne({_id: req.user.id});

    if (user) {
        let array = [];
        if (user.productList) {
            array = user.productList;
        }
        for (let i = 0; i < productList.length; i++) {
            array.push(productList[i])
        }
        productList = array
        await User.updateOne({_id: req.user.id}, {productList});
        await orderQueue();
    }
    return res.status(200).send("Products added!");
}


exports.deleteProduct = async (req, res) => {
    const deleteProductId = req.params.id
    let user = await User.findOne({_id: req.user.id});
    if (user) {
        let array = [];
        for (var i = 0; i < user.productList.length; i++) {
            if (!user.productList[i].equals(deleteProductId)) {
                array.push(user.productList[i])
            }
        }
        await User.updateOne({_id: req.user.id}, {productList: array})
    }
    return res.status(200).send("Products deleted!");
}


exports.deleteAllProduct = async (req, res) => {
    let user = await User.findOne({_id: req.user.id});
    if (user) {
        let array = [];
        await User.updateOne({_id: req.user.id}, {productList: array})
    }
    return res.status(200).send("Products deleted!");
}


exports.addAdminProduct = async (req, res) => {
    const {adminId, selectedProducts, productId} = req.body
    const adminProduct = new AdminProductQueue({
        adminId, selectedProducts
    })
    adminProduct.save()
        .then(data => {
            //res.send(data)
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}


exports.findUserByPhoneNumber = async (req, res) => {
    const number = req.params.phonenumber
    if (number) {
        await User.find({phonenumber: number})
            .then(data => {
                if (data.length === 0) {
                    return res.status(400).send('Error!')
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({message: "Error retrieving user with id " + id})
            })
    }
};

exports.otpSend = async (req, res) => {
    const id = req.params.id;
    const {otp} = req.body;
    await User.updateOne({_id: id}, {otp: otp});
    return res.status(200).send("OTP send!!");
};

exports.updateUserPassword = async (req, res, next) => {
    try {
        let newPassword = req.body.password;

        let user = await User.findById(req.params.id)


        if (user) {
            const salt = await bcrypt.genSalt(10);
            let newPasswords = await bcrypt.hash(newPassword, salt);
            await User.findByIdAndUpdate(req.params.id, {password: newPasswords});

            res.status(200).send("password updated!");
        }
    } catch (err) {
        return next(new ErrorResponse('something went wrong' + err));
    }
}


exports.getAllUserList = async (req, res) => {
    try {
        let users = await User.find({
            $and: [{
                $or: [{role: "user", disabled: false}]
            }, {phonenumber: {$exists: true}}]
        }, {_id: 1, username: 1, userIdNo: 1, phonenumber: 1});


        return res.status(201).send(users);
    } catch (err) {
        res.status(500).json(err);
    }
}


exports.getActiveUserList = async (req, res) => {
    try {
        const activeUserList = await Wallet.find({totalOrder: {$gt: 0}}, {userId: 1})
            .populate('userId', ['_id','username','phonenumber','userIdNo'])

        return res.status(201).send(activeUserList);

    } catch (err) {
        res.status(500).json(err);
    }
}