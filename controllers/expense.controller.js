const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
    const newExpense = new Expense({
      user: req.user.id,
      category: req.body.category,
      amount: req.body.amount,
      date: new Date(req.body.date),
    });
    const savedExpense = await newExpense.save();
    res.json(savedExpense);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error..");
  }
};

const deleteExpense = async (req, res) => {
  try {
    //Find Expense to be deleted and delete it
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).send("Not Found");
    }
    //Allow deletion only if user owns this Expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    expense = await Expense.findByIdAndDelete(req.params.id);
    res.json({ Success: "expense has been deleted", expense: expense });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error..");
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const allExpenses = await Expense.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(allExpenses);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error..");
  }
};

module.exports = { addExpense, deleteExpense, getAllExpenses };
