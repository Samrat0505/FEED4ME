const Farmers = require("../models/farmerSchema");
const Customers = require("../models/customerSchema");
const Storage = require("../models/storageSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendSMS = require("../services/smsService");
const OTP = require("../models/otpSchema");
const CustomError = require("../utils/customError");



const secretKey = process.env.TOKEN_SECRET;

const generateAccessToken = (username) => {
  return jwt.sign(username, secretKey);
};

const generateOTP = () => {
  const rand = Math.floor(10000 + Math.random() * 9000);
  return rand;
};


//login service
const loginUser = async (identifier, password, role) => {
  let Model;
  switch (role.toLowerCase()) {
    case "farmer":
      Model = Farmers;
      break;
    case "customer":
      Model = Customers;
      break;
    case "storage":
      Model = Storage;
      break;
    default:
      throw new CustomError("Invalid role specified", 400);
  }
  const user = await Model.findOne({ $or: [{ mobile: identifier.toString() }, { email: identifier }] });
  console.log(user)
  if (!user) throw new CustomError("Wrong credentials!", 401);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new CustomError("Wrong credentials!", 401);
  const token = generateAccessToken(user.mobile);
  return { user, token };
};


//register service
const initiateRegistration = async (mobile, password, role) => {
  let Model;
  switch (role.toLowerCase()) {
    case "farmer":
      Model = Farmers;
      break;
    case "customer":
      Model = Customers;
      break;
    case "storage":
      Model = Storage;
      break;
    default:
      throw new CustomError("Invalid role specified", 400);
  }
  const existingUser = await Model.findOne({ $or: [{ mobile: identifier.toString() }, { email: identifier }] });
  if (existingUser) throw new CustomError("User already registered!", 400);
  const otp = generateOTP();
  //   const to = "+91" + mobile;
  const to = "+917819977069";
  const body = `Dear customer, OTP to register with FEED4me is ${otp}. Please enter this code on the login page. Expires in 15 minutes.`;
  if (await OTP.findOne({ mobile })) await OTP.findOneAndUpdate({ mobile },{ otp, createdAt: new Date() });
  else await OTP.create({ mobile, otp });
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  await sendSMS.createMessage(body, to);
  const message = "OTP sent successfully";
  return { hashedPass, message };
};


//verify otp service
const verifyOTPAndRegister = async (mobile, otp, pendingRegistration, role) => {
  let Model;
  switch (role.toLowerCase()) {
    case "farmer":
      Model = Farmers;
      break;
    case "customer":
      Model = Customers;
      break;
    case "storage":
      Model = Storage;
      break;
    default:
      throw new CustomError("Invalid role specified", 400);
  }
  const otpRecord = await OTP.findOne({ mobile });
  if (!otpRecord) throw new CustomError("OTP expired or invalid!", 404);
  console.log(otpRecord);
  if (otpRecord.otp !== otp) throw new CustomError("Invalid OTP!", 401);
  const newUser = await Model.create({
    name: pendingRegistration.name,
    mobile: pendingRegistration.mobile,
    password: pendingRegistration.hashedPass,
    age: pendingRegistration.age,
    location: pendingRegistration.location,
  });
  const token = generateAccessToken(newUser.mobile);
  await OTP.deleteOne({ mobile });
  return { message: "Registration successful", user: newUser, token };
};


//delete user service
const deleteUser = async (mobile, role) => {
  let Model;
  switch (role.toLowerCase()) {
    case "farmer":
      Model = Farmers;
      break;
    case "customer":
      Model = Customers;
      break;
    case "storage":
      Model = Storage;
      break;
    default:
      throw new CustomError("Invalid role specified!", 400);
  }
  await Model.deleteOne({ mobile });
};

module.exports = {
  initiateRegistration,
  verifyOTPAndRegister,
  loginUser,
  deleteUser,
};
