require("dotenv").config();
const express = require("express");
const mongoConnect = require("./db.js");
const authRoute = require("./routes/authRoute");

const app = express();
const port = 3000;
mongoConnect();

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});