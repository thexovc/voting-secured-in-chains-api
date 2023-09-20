const express = require("express");
const {
  login,
  register,
  updateProfile,
  getAllUsers,
} = require("../controller/authController");
const { loginWithOTPService } = require("../services/authService");

const router = express.Router();

router.post("/login", login);
router.post("/otp", loginWithOTPService);
router.post("/register", register);
router.post("/updateProfile/:id", updateProfile);
router.get("/users", getAllUsers);

module.exports = router;
