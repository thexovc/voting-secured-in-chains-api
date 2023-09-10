const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");
// const { transporter } = require("../utils/nodemailer");

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "kyilaxtech@gmail.com",
    pass: `${process.env.EMAIL_PASS}`,
  },
});

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

const sendEmail = async (newUser) => {
  try {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "../emails/welcome.ejs"),
      "utf-8"
    );

    const mailOptions = {
      from: "kyilaxtech@gmail.com",
      to: newUser.email,
      subject: "Welcome to VSC",
      html: ejs.render(emailTemplate, {
        newUser,
      }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

module.exports = {
  registerService,
  loginService,
  updateProfileService,
  sendEmail,
};
