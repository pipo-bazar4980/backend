const express = require('express')
const {register,login,forgotPassword,resetPassword, GoogleAuth} = require('../controllers/auth')
const router = express.Router()


router.route('/register').post(register)
router.route('/google').post(GoogleAuth)
router.route('/login').post(login)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:resetToken').put(resetPassword)
router.route('changePassword/:id').put()

module.exports = router