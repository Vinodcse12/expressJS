const express = require('express');

const app = express();

app.use("/admin", (req, res, next) => {
  console.log("Welcome to the admin panel");
  if (req.query.admin === "true") {
    res.status(403).send("Access denied");
  } else {
    next();
  }
  
});

app.get("/admin/getAllData", (req, res) => {
  res.send("Welcome to the home page");
});

app.listen(3000, () => { 
  console.log('Server is running on http://localhost:3000');
  console.log('Server is running on http://localhost:3000');
});