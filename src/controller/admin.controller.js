const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    // Remove the 'password' field from each user
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({ users: usersWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const validateUserById = async (req, res) => {
  try {
    // Check if the user with the provided user ID exists

    const { id: userId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    // Update the 'validated' field to true for the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { validated: true },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error validating user by ID:", error);
    return res.status(500).json({ message: "User validation failed" });
  }
};

module.exports = {
  getAllUsers,
  validateUserById,
};
