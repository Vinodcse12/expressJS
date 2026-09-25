const express = require("express");

const authRouter = express.Router();

const { validateSignupData } = require("../utils/validation");
const Users = require("../models/users");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const users = new Users({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await users.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await Users.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    
    // const isPasswordValid = await bycrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Create a JWT token
      // const token = jwt.sign({ _id: user._id }, "DevTenderSecretKey", { expiresIn: "1h" });
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000), // 1 hour
      });
      res.status(200).json("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(0) });
  res.status(200).json("Logout successful");
});


module.exports = authRouter;
