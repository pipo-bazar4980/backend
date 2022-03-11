
const googleOAuth = require('../utils/googleOAuth');
const User = require("../models/Auth");

exports.login = async (req, res) => {
    console.log(res)
    // try {
    //     const code = req.body.code;
    //     const profile = await googleOAuth.getProfileInfo(code);
    //
    //     const user = {
    //         googleId: profile.sub,
    //         name: profile.name,
    //         // firstName: profile.given_name,
    //         // lastName: profile.family_name,
    //         email: profile.email,
    //         profilePic: profile.picture,
    //     };
    //     let userId = await User.findOne({googleId: profile.sub, email: profile.email});
    //     if (userId) {
    //         console.log(user)
    //     } else {
    //         const users = new User({googleId: profile.sub, email:  profile.email, username: profile.name});
    //         await user.save();
    //     }
    //     // res.send({user});
    // } catch (e) {
    //     console.log(e);
    //     res.status(401).send();
    // }
};