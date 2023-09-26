const express = require("express");
const {
  validateUserById,
  getAllUsers,
  unvalidateUser,
  getAllValidatedUser,
} = require("../controller/admin.controller");

const router = express.Router();

function isAdmin(req, res, next) {
  const user = req.user;
  if (user && user.admin) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Only admins can perform this action." });
  }
}

router.post("/getAllUsers", getAllUsers);
router.post("/validateUser/:id", validateUserById);
router.get("/validated-users", getAllValidatedUser);
router.post("/unvalidate-user/:userId", unvalidateUser);

module.exports = router;
