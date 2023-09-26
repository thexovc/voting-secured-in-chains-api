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

const getAllValidatedUser = async (req, res) => {
  try {
    const validatedUsers = await prisma.user.findMany({
      where: {
        validated: true,
      },
    });
    res.json(validatedUsers);
  } catch (error) {
    console.error("Error fetching validated users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const unvalidateUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        validated: false,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(`Error unvalidating user with ID ${userId}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllUsers,
  validateUserById,
  getAllValidatedUser,
  unvalidateUser,
};
