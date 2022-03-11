const express = require("express");
const router = express.Router();
const { getVisitorsPerDay,increaseVisitors,create } = require("../controllers/visitors");

router.route("/").get(getVisitorsPerDay);
router.route("/").put(increaseVisitors);
router.route("/").post(create);

module.exports = router;