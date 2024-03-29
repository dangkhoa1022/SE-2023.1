import User from '../models/userModel.mjs';
// const crypto = require('crypto');
import crypto from 'crypto';
import sendEmail from '../ultils/sendEmail.mjs';

// Hàm hiển thị form quên mật khẩu
const getForgotPasswordForm = (req, res) => {
  res.status(200).render('forgot-password', {
    title: 'Quên mật khẩu',
    error: null,
  });
};

// Hàm xử lý yêu cầu quên mật khẩu
const processForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).render('resetAnnouce', {
        title: 'Quên mật khẩu',
        error: 'Email không tồn tại',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpires = Date.now() + 3600000; // 1 giờ

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetUrl = `http://${req.headers.host}/reset-password/${resetToken}`;

    // Gửi email với đường dẫn đặt lại mật khẩu
    const mailOptions = {
      to: user.email,
      subject: 'Đặt lại mật khẩu',
      text: `Vui lòng truy cập ${resetUrl} để đặt lại mật khẩu của bạn.`,
    };

    await sendEmail(mailOptions);

    res.render('forgot-password', {
      title: 'Quên mật khẩu',
      success: 'Đã gửi email đặt lại mật khẩu',
    });
  } catch (err) {
    console.error(err);
    res.render('forgot-password', {
      title: 'Quên mật khẩu',
      error: 'Lỗi máy chủ',
    });
  }
};

export {
  getForgotPasswordForm,
  processForgotPassword,
};