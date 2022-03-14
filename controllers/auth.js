const User = require('../models/Auth');
const Wallet = require('../models/Wallet');
const UserInfo = require('../models/USerInfo');
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const _ = require('lodash');

let jwtToken = null;

// @desc    Register user
exports.register = async (req, res, next) => {

    const userCount = await User.find()
    const userLength = userCount.length+1;

    const { email, phonenumber } = req.body;
    let user = {};
    user = await User.findOne({ email: email })
    if (user) return res.status(400).send('User already register!')

    let userNumber = await User.findOne({ phonenumber: phonenumber })
    if (userNumber) return res.status(400).send('Phone Number already exists!')

    try {
        user = new User(_.pick(req.body, ['username', 'email', 'phonenumber', 'password']));

        if (req.body.role) {
            user.role = req.body.role
        }
        const wallet = await Wallet.create({
            totalAmount: 0,
            spentAmount: 0,
            currentAmount: 0,
            totalOrder: 0,
            userId: user._id
        });
        user.wallet = wallet._id
        user.userIdNo=100 + userLength
        await user.save();
        sendToken(user, 200, res);

    } catch (err) {
        next(err);
    }
};

// @desc    Login user
exports.login = async (req, res, next) => {

    const { email, password } = req.body;

    // Check if email and password is provided
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    try {
        // Check that user exists by email
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        // Check that password match
        const isMatch = await user.matchPasswords(password);

        if (user.disabled === true) {
            return next(new ErrorResponse("User does not exist!", 401));
        }
        if (!isMatch) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        sendToken(user, 200, res);
        await saveInfo(user, 200, res);
    } catch (err) {
        next(err);
    }
};


exports.forgotPassword = async (req, res, next) => {
    // Send Email to email provided but first check if user exists
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse("No email could not be sent", 404));
        }

        // Reset Token Gen and add to database hashed (private) version of token
        const resetToken = user.getResetPasswordToken();

        await user.save();

        // Create reset url to email to provided email
        const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;

        // HTML Message
        const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            res.status(200).json({ success: true, data: "Email Sent" });
        } catch (err) {

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (err) {
        next(err);
    }
};
exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new ErrorResponse("Invalid Token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Password Updated Success",
            token: user.getSignedJwtToken(),
        });
    } catch (err) {
        next(err);
    }
}


const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const { password, ...info } = user._doc;

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_TOKEN),
        // secure:true,
        httpOnly: true,
    }).status(statusCode).json({ success: true, ...info, token });
};

module.exports.sendTokenOauth = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const { password, ...info } = user._doc;
    const expires = new Date(Date.now() + process.env.JWT_TOKEN);
    jwtToken = token;

    //res.redirect(302, 'http://localhost:3000/login');
    res.redirect(302, 'https://client-4x8r4.ondigitalocean.app/login');
    //res.redirect(302, 'https://sizishop.xiphersoft.com/login');

};

exports.getJwt = async (req, res, next) => {
    return res.status(200).send(jwtToken)
};

exports.removeJwt = async (req, res, next) => {
    jwtToken = ''
};


const saveInfo = async (user, statusCode, res) => {
    const user_id = user._id
    try {
        const userInfo = await UserInfo.create({
            user_id
        });
    } catch (err) {
        res.send(err);
    }

}
