const express = require("express");
const {
  validateUserById,
  getAllUsers,
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

module.exports = router;
