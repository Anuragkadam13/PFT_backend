const connectToMongo = require("./config/db");
const express = require("express");
var cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 8000;

connectToMongo()
  .then(() => {
    app.use(express.json());
    app.use(
      cors({
        origin: ["https://pft-frontend.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );

    //Available routes
    app.use("/api/auth", require("./routes/auth.route"));
    app.use("/api/income", require("./routes/income.route"));
    app.use("/api/expense", require("./routes/expense.route"));
    app.use("/api/dashboard", require("./routes/dashboard.route"));

    app.listen(port, () => {
      console.log(
        `Personal Finance Tracker Database listening on port ${port}`
      );
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB:", err));
