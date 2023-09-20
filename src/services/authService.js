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
      validated: false,
      confirmed: false,
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

  if (!user.confirmed) {
    await sendOTPService(email);
    throw new Error("User is not confirmed");
  }

  if (!user.validated) {
    throw new Error("User is not validated");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      matNo: user.matNo,
      admin: user.admin,
      candidate: user.candidate,
      manifesto: user.manifesto,
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
      manifesto: user.manifesto,
    },
  };
};

const loginWithOTPService = async (email, otp) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.confirmed) {
    throw new Error("User is not confirmed");
  }

  // Verify the provided OTP
  const otpVerified = await verifyOTP(email, otp);

  if (!otpVerified) {
    throw new Error("OTP verification failed");
  }

  if (!user.validated) {
    throw new Error("User is not validated");
  }

  // Generate JWT token for authenticated user
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

const generateRandomOTP = () => {
  // Generate a 6-digit random OTP (you can adjust the length if needed)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const sendOTPService = async (email) => {
  try {
    // Generate a random OTP
    const otp = generateRandomOTP();

    // Save the OTP in the database for the user
    await prisma.user.update({
      where: { email },
      data: { otp },
    });

    // Send the OTP to the user's email
    const emailTemplate = `
      <p>Your OTP is: ${otp}</p>
      <p>Please use this OTP to confirm your registration.</p>
    `;

    const mailOptions = {
      from: "kyilaxtech@gmail.com",
      to: email,
      subject: "OTP Confirmation",
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
      } else {
        console.log("OTP Email sent:", info.response);
      }
    });

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Error sending OTP");
  }
};

const verifyOTP = async (email, providedOTP) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the provided OTP matches the one in the database
    if (providedOTP !== user.otp) {
      throw new Error("Invalid OTP");
    }

    // Update the user's 'confirmed' field to true
    await prisma.user.update({
      where: { email },
      data: { confirmed: true },
    });

    return true;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("Error verifying OTP");
  }
};

module.exports = {
  registerService,
  loginService,
  updateProfileService,
  sendEmail,
  loginWithOTPService,
  verifyOTP,
};
