const Income = require("../models/Income");

const addIncome = async (req, res) => {
  try {
    const newIncome = new Income({
      user: req.user.id,
      source: req.body.source,
      amount: req.body.amount,
      date: new Date(req.body.date),
    });
    const savedIncome = await newIncome.save();
    res.json(savedIncome);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error..");
  }
};

const deleteIncome = async (req, res) => {
  try {
    //Find Income to be deleted and delete it
    let income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).send("Not Found");
    }
    //Allow deletion only if user owns this Income
    if (income.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    income = await Income.findByIdAndDelete(req.params.id);
    res.json({ Success: "income has been deleted", income: income });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error..");
  }
};

const getAllIncomes = async (req, res) => {
  try {
    const allIncomes = await Income.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(allIncomes);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error..");
  }
};

module.exports = { addIncome, deleteIncome, getAllIncomes };
