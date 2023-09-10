const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "kyilaxtech@gmail.com",
    pass: `${process.env.EMAIL_PASS}`,
  },
});

module.exports = {
  transporter,
};
