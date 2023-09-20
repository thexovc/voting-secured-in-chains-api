const express = require("express");
const {
  login,
  register,
  updateProfile,
  getAllUsers,
  verifyOtp,
} = require("../controller/authController");

const router = express.Router();

router.post("/login", login);
router.post("/otp", verifyOtp);
router.post("/register", register);
router.post("/updateProfile/:id", updateProfile);
router.get("/users", getAllUsers);

module.exports = router;
