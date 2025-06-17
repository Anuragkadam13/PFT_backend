const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");
const getDashboardData = require("../controllers/dashboard.controller");

router.get("/getDashboardData", checkUser, getDashboardData);

module.exports = router;
