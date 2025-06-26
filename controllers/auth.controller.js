const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

//CreateUser Controller
const createUser = async (req, res) => {
  let success = false;
  const result = validationResult(req);
  //Shows error and bad request if there is any..
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  try {
    //Check whether the user with same email is already exist or not
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({
        success,
        error: "Sorry, a user with this email already exist..",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    //Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: {
        id: user._id,
      },
    };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    res.json({ success, authToken });
  } catch (error) {
    console.log(error);
    res.status(500).send("Some error occured");
  }
};

//Login Controller
const loginUser = async (req, res) => {
  let success = false;
  const result = validationResult(req);
  //Shows error and bad request if there is any..
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }

  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({
        success,
        error: "Please try to login with correct credentials",
      });
    }
    const data = {
      user: {
        id: user._id,
      },
    };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    res.json({ success, authToken });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error..");
  }
};

//Get User details Controller
const getUser = async (req, res) => {
  let success = true;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json({ success, user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error..");
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
};
