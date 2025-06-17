const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");
const {
  addExpense,
  deleteExpense,
  getAllExpenses,
} = require("../controllers/expense.controller");

router.post("/addExpense", checkUser, addExpense);

router.delete("/deleteExpense/:id", checkUser, deleteExpense);

router.get("/getAllExpenses", checkUser, getAllExpenses);
module.exports = router;
