const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    //Fetch total income and expenses
    const totalIncome = await Income.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    //Last 60 days Income transactions
    const last60DaysIncomeTransactions = await Income.find({
      user: userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //Total Income for last 60 days
    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    //Expense transactions in last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      user: userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //Total Expense in last 30 Days
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    //Fetch last 5 transactions (income + expense)
    const lastTransactions = [
      ...(await Income.find({ user: userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "income",
        })
      ),
      ...(await Expense.find({ user: userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "expense",
        })
      ),
    ].sort((a, b) => b.date - a.date); //Sort latest first

    //Final response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      recentTransactions: lastTransactions,
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      last30DaysExpense: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error..");
  }
};

module.exports = getDashboardData;
