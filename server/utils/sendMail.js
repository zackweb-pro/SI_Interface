const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider (e.g., Gmail, Outlook)
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "webzack0@gmail.com", // Replace with your email
        pass: "vviy fuhv wozt vvxg", // Replace with your email password or app-specific password
      },
    });

    const mailOptions = {
      from:{
        name: "ECS_ADMINISTRATION", // Replace with your name
        address: "webzack0@gmail.com"
      }, // Replace with your email
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmail };
