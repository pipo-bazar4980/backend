const router = require('express').Router();
const passport = require('passport');
require('../config/authFacebookConfig');
const {sendTokenOauth}=require('../controllers/auth');

router.route('/')
    .get(passport.authenticate("facebook"));


router.route('/redirect')
    .get(passport.authenticate("facebook", { session: false }), (req, res) => {
        sendTokenOauth(req.user,200,res);
    })

module.exports = router;

