// const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer';

// Cấu hình thông tin SMTP để gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Sử dụng dịch vụ Gmail
  auth: {
    user: 'your-email@gmail.com', // Email gửi
    pass: 'your-email-password' // Mật khẩu email
  }
});

// Hàm gửi email
const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// module.exports = sendEmail;

export default sendEmail;