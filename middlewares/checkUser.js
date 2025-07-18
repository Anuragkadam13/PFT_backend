var jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  //Get user from jwt token and add id to request object
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = checkUser;
