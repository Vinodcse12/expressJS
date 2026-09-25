const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid");
    }
    
    const decoded = jwt.verify(token, "DevTenderSecretKey");

    const { _id } = decoded;
    const user = await Users.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    userAuth
}