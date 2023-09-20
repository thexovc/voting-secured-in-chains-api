const authService = require("../services/authService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { email, password, name, matNo } = req.body;
    const newUser = await authService.registerService(
      name,
      email,
      password,
      matNo
    );

    await authService.sendEmail(newUser);

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tokenUser = await authService.loginService(email, password);
    res.json(tokenUser);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyOTP(email, otp);
    return res.status(200).json({ message: "OTP verification successful" });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const updatedUser = await authService.updateProfileService(
      userId,
      req.body
    );
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
}

module.exports = {
  register,
  login,
  updateProfile,
  getAllUsers,
  verifyOtp,
};
