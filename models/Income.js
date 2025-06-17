const mongoose = require("mongoose");
const { Schema } = mongoose;

const IncomeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  source: {
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
const Income = mongoose.model("income", IncomeSchema);

module.exports = Income;
