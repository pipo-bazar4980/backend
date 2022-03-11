const express = require('express');
const {activeUser} = require('../controllers/activeUser');


const router = express.Router();

router.route('/:id').post(activeUser);

module.exports = router