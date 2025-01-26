const authService = require("../services/authService");

const loginService = async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const { user, token } = await authService.loginUser(mobile, password);
    res.json({ status: "Logged in successfully", data: user, token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

const registerService = async (req, res) => {
  const { name, mobile, password, age, location } = req.body;
  try {
    const { user, token } = await authService.registerUser(name, mobile, password, age, location);
    res.status(201).json({ status: "Registration successful", userData: user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  loginService,
  registerService,
};