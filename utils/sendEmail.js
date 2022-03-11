
const nodemailer = require("nodemailer");

const sendEmail = (options, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ms626282@gmail.com',
            pass: 'asif25801739ahsan'
        }
    });

    const mailOptions = {
        from: "ms626282@gmail.com",
        to: options.to,
        subject: options.subject,
        html: options.text,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
            res.send("An reset password liked email has been sent to your email address. Please  click the link to reset your password")
        }
    });
};

module.exports = sendEmail;