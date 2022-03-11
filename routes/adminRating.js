const express = require('express')
const { create, findAllRating, findOneRating, updateRating} = require('../controllers/ratingAdmin')
const {protect} = require("../middleware/auth");

const router = express.Router()

router.route('/:id').post( protect, create);
router.route('/').get( findAllRating);
router.route('/find/').get( findOneRating);
router.route('/update/:id').put( protect, updateRating);

module.exports = router;