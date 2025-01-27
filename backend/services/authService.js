const Farmer = require("../models/farmerSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendSMS = require("../services/smsService");
const OTP = require("../models/otpSchema");
const CustomError = require('../utils/customError');



const secretKey = process.env.TOKEN_SECRET;



const generateAccessToken = (username) => {
  return jwt.sign(username, secretKey);
};

const generateOTP = () => {
  const rand = Math.floor(10000 + Math.random() * 9000);
  return rand;
};





//login service
const loginUser = async (mobile, password) => {
  const user = await Farmer.findOne({ mobile });
  if (!user) {
    throw new CustomError('No user found!', 404);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError('Incorrect password!', 401);
  }
  const token = generateAccessToken(user.mobile);
  return { user, token };
};




//register service
const initiateRegistration = async (mobile, password) => {
  const existingUser = await Farmer.findOne({ mobile });
  if (existingUser) {
    throw new CustomError('User already registered!', 400);
  }
  const otp = generateOTP();

//   const to = "+91" + mobile;
  const to = "+917819977069";
  const body = `Dear customer, OTP to register with FEED4me is ${otp}. 
                Please enter this code on the login page. Expires in 15 minutes.`;

  if(await OTP.findOne({mobile})){
    await OTP.findOneAndUpdate({ mobile }, { 
        otp,
        createdAt: new Date()
      }
    );
  }
  else{
    await OTP.create({
        mobile,
        otp,
      });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  await sendSMS.createMessage(body, to);
  const message = "OTP sent successfully";
  return { hashedPass, message };
};




//verify otp service
const verifyOTPAndRegister = async (mobile, otp, pendingRegistration) => {
  const otpRecord = await OTP.findOne({ mobile });
  if (!otpRecord) {
    throw new CustomError('OTP expired or invalid!', 404);
  }
  console.log(otpRecord)
  if (otpRecord.otp !== otp) {
    throw new CustomError('Invalid OTP!', 401);
  }

  const newUser = await Farmer.create({
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







module.exports = {
  initiateRegistration,
  verifyOTPAndRegister,
  loginUser,
};
