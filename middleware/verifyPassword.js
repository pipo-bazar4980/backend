const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/Auth")

exports.verifyPassword = async (req, res, next) => {

    const {oldPassword, email} = req.body

    try {
        // Check that user exists by email
        const user = await User.findOne({email}).select("+password");

        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        // Check that password match
        const isMatch = await user.matchPasswords(oldPassword);

        if (user.disabled === true) {
            return next(new ErrorResponse("User does not exist!", 401));
        }
        if (!isMatch) {
            res.status(200).send("wrong password!");
        }
        else {
            console.log('ok')
            next()
        }

    } catch (err) {
        next(err);
    }
}