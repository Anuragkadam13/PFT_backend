const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const checkUser = require("../middlewares/checkUser");
const {
  createUser,
  loginUser,
  getUser,
} = require("../controllers/auth.controller");

//ROUTE 1: Create new user using POST:"/api/auth/createUser"
router.post(
  "/createUser",
  [
    body("name")
      .isLength({ min: 5 })
      .withMessage("name must have 5 characters")
      .notEmpty()
      .withMessage("username empty"),
    body("email").isEmail().withMessage("not a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("password must have 8 characters"),
  ],
  createUser
);

//ROUTE 2: login user without login  POST:"/api/auth/login"
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("not a valid email"),
    body("password").exists().withMessage("Password cannot be blank"),
  ],
  loginUser
);

//ROUTE 3: Get loggedin user details POST:"/api/auth/getuser"
router.get("/getuser", checkUser, getUser);
module.exports = router;
