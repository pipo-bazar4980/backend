const router = require('express').Router();
const passport = require('passport');
require('../config/authGoogleConfig');
const { sendTokenOauth } = require('../controllers/auth');


router.route('/')
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));


router.route('/redirect')
    .get(passport.authenticate("google", { session: false }), (req, res) => {
        sendTokenOauth(req.user, 200, res)
    })

module.exports = router;



