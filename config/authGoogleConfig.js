const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/Auth');
const Wallet = require('../models/Wallet');
const _ = require('lodash');

const strategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //callbackURL: "http://localhost:3001/auth/google/redirect"
    callbackURL: "https://backend-emqvf.ondigitalocean.app/auth/google/redirect"
}, async (accessToken, refreshToken, profile, cb) => {
    let user = await User.findOne({ googleId: profile.id, email: profile._json.email });
    if (user) {
        cb(null, user);
    } else {
        const userCount = await User.find()
        const userLength = userCount.length + 1;
        user = new User({ googleId: profile.id, email: profile._json.email, username: profile._json.name });
        const wallet = await Wallet.create({
            totalAmount: 0,
            spentAmount: 0,
            currentAmount: 0,
            totalOrder: 0,
            userId: user._id
        });
        user.wallet = wallet._id
        user.userIdNo = 100 + userLength
        await user.save();
        cb(null, user);
    }
});

passport.use(strategy);

