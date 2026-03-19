const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, html }) => {

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `City Issue Tracker <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html
  });
};

module.exports = sendEmail;