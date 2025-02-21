require("dotenv").config();
const express = require("express");
const connectDB = require("./db.js");
const session = require('express-session')
const authRoute = require("./routes/authRoute");
const testRoute = require("./routes/testRoute");
const farmerRouter = require("./routes/farmerRouter");
const cropRouter = require("./routes/cropRoute")


// Middlewares
const app = express();
const port = 3000;
connectDB();

app.use(express.static("public"));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 900000 } // 15 minutes
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoute);
app.use("/api/farmer", farmerRouter)
app.use("/api/crops", cropRouter)
app.use("/api/test", testRoute);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});