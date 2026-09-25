const express = require("express");
const Users = require("./models/users");
const connectDB = require("./config/database");
const bycrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const {validateSignupData} = require("./utils/validation");
const app = express();  

app.use(express.json());

app.use(cookieParser());

app.post("/signup", async (req, res) => {  

  try {
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bycrypt.hash(password, 10);
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/sendConnectionRequest" , userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + "send the connection request to ");
})

app.get("/user", async (req, res) => {
  const userEmail = req.body.userEmail;
  try {
    const users = await Users.find({emailId: userEmail});
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 

app.get("/feed", async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  try {
    const deletedUser = await Users.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }


})

app.patch("/update/:userId", async (req, res) => {
  // const userId = req.body.userId;
  const userId = req.params.userId;
  const updateData = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender"];
    const isUpdateAllowed = Object.keys(updateData).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid update data");
    }
    const updatedUser = await Users.findByIdAndUpdate(userId, updateData, { 
      returnDocument: "after",
      runValidators: true
     });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// app.use("/admin", (req, res, next) => {
//   console.log("Welcome to the admin panel");
//   if (req.query.admin === "true") {
//     res.status(403).send("Access denied");
//   } else {
//     next();
//   }

// });

// app.get("/admin/getAllData", (req, res) => {
//   res.send("Welcome to the home page");
// });

// app.use("/app", (err, req, res ) => {
//   if (err) {
//     res.status(500).send("Internal server error");
//   }
// })
