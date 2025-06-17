const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExpenseSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Expense = mongoose.model("expense", ExpenseSchema);

module.exports = Expense;
