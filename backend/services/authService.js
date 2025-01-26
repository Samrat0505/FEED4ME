const Farmer = require("../models/farmerSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = process.env.TOKEN_SECRET;

const generateAccessToken = (username) => {
  return jwt.sign(username, secretKey);
};

const loginUser = async (mobile, password) => {
  const user = await Farmer.findOne({ mobile });
  if (!user) {
    throw new Error("No user found!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password!");
  }

  const token = generateAccessToken(user.mobile);
  return { user, token };
};

const registerUser = async (name, mobile, password, age, location) => {
  const existingUser = await Farmer.findOne({ mobile });
  if (existingUser) {
    throw new Error("User already registered!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = await Farmer.create({
    name,
    mobile,
    password: hashedPass,
    age,
    location,
  });

  const token = generateAccessToken(newUser.mobile);
  return { user: newUser, token };
};

module.exports = {
  loginUser,
  registerUser,
};