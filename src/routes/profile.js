const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid fields in request body');
    }

    const loggedUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedUser[key] = req.body[key];
    });

    await loggedUser.save();
    res.status(200).json({
      message: `${loggedUser.firstName}, your profile has been updated successfully`,
      data: loggedUser
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = profileRouter;
