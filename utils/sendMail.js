const nodemailer = require("nodemailer");
const ErrorResponse = require("./errorResponse");
module.exports.sendEmail = async (options, res, next) => {
    try {
        const mail = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ms626282@gmail.com',
                pass: 'asif25801739ahsan'
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.text,
        };

        mail.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }

        })
    } catch (err) {
        return next(new ErrorResponse("Something Went wrong", err))
    }
}