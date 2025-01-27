const authService = require("../services/authService");


//login controller
const loginController = async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const { user, token } = await authService.loginUser(mobile, password);
    res.json({ status: "Logged in successfully", data: user, token });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};



//register controller
const initialRegisterController = async (req, res) => {
  const { name, mobile, password, age, location } = req.body;
  try {
    const { hashedPass, message } =
      await authService.initiateRegistration(
        name,
        mobile,
        password,
        age,
        location
      );

    req.session.pendingRegistration = {
      name,
      mobile,
      hashedPass,
      age,
      location,
    };

    res.status(201).json({ status: "Registration successful", message });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};



//verify otp controller
const verifyRegisterController = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const pendingRegistration = req.session.pendingRegistration;
    console.log(req.session)
    if (!pendingRegistration) {
      return res.status(400).json({ error: "Registration session expired" });
    }

    const resp = await authService.verifyOTPAndRegister(
      mobile,
      otp,
      pendingRegistration
    );
    delete req.session.pendingRegistration;
    res.status(201).json(resp);
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};







module.exports = {
  loginController,
  initialRegisterController,
  verifyRegisterController,
};
