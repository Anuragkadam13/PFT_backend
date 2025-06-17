const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");
const {
  addIncome,
  deleteIncome,
  getAllIncomes,
} = require("../controllers/income.controller");

router.post("/addIncome", checkUser, addIncome);

router.delete("/deleteIncome/:id", checkUser, deleteIncome);

router.get("/getAllIncomes", checkUser, getAllIncomes);
module.exports = router;
