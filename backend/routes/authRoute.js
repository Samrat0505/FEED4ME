const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post('/register/initiate', authController.initialRegisterController);
router.post('/register/verify', authController.verifyRegisterController);
router.post('/login', authController.loginController);

module.exports = router;