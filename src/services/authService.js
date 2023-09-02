const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const registerService = async (name, email, password, matNo) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      matNo: matNo,
    },
  });
  return newUser;
};

const loginService = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      matNo: user.matNo,
      admin: user.admin,
      candidate: user.candidate,
    },
    "super-secretdydgds",
    {
      expiresIn: "3h",
    }
  );
  return {
    token,
    user: {
      userId: user.id,
      email: user.email,
      name: user.name,
      matNo: user.matNo,
      admin: user.admin,
      candidate: user.candidate,
    },
  };
};

const updateProfileService = async (userId, updatedData) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
  });
  return updatedUser;
};

module.exports = {
  registerService,
  loginService,
  updateProfileService,
};
