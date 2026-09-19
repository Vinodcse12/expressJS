const express = require("express");
const Users = require("./models/users");
const connectDB = require("./config/database");
const app = express();

app.use(express.json());

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

app.post("/signup", async (req, res) => {
  // Read data from req.body

  // const userObj = {
  //   firstName: "vikram",
  //   lastName: "sharma",
  //   emailId:"vikram.sham@example.com",
  //   password: "asasdad",
  //   age: 23,
  //   gender: "male"
  // };

  try {
    const users = new Users(req.body);
    await users.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
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
