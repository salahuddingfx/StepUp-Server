const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { generateOTP, getOTPExpiryTime, verifyOTP } = require('../services/otp.service');
const { sendOTPEmail, sendWelcomeEmail, sendResetPasswordEmail } = require('../services/mail.service');
const { sendTokenResponse, generateAccessToken } = require('../services/auth.service');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res, next) => {
  const { name, email, password, role, targetClass } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const otpCode = generateOTP();
    const otpExpires = getOTPExpiryTime(10); // 10 mins

    user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      otp: {
        code: otpCode,
        expiresAt: otpExpires
      }
    });

    // Create role-specific profiles
    if (user.role === 'student') {
      await Student.create({
        user: user._id,
        targetClass: targetClass || 'Spoken English Learner'
      });
    } else if (user.role === 'teacher') {
      await Teacher.create({
        user: user._id,
        expertise: ['General English']
      });
    }

    // Send verification email
    try {
      await sendOTPEmail(user.email, user.name, otpCode);
    } catch (mailError) {
      console.error('Registration email fail:', mailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification OTP.'
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended' });
    }

    // If email is not verified, they must verify first
    if (!user.isEmailVerified) {
      const otpCode = generateOTP();
      user.otp = {
        code: otpCode,
        expiresAt: getOTPExpiryTime(10)
      };
      await user.save();
      await sendOTPEmail(user.email, user.name, otpCode);

      return res.status(403).json({
        success: false,
        isEmailVerified: false,
        message: 'Email not verified. A new OTP has been sent to your email.'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Verify OTP (Email confirmation)
exports.verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const check = verifyOTP(user, code);
    if (!check.valid) {
      return res.status(400).json({ success: false, message: check.message });
    }

    user.isEmailVerified = true;
    user.otp = undefined; // clear otp
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Resend OTP
exports.resendOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otpCode = generateOTP();
    user.otp = {
      code: otpCode,
      expiresAt: getOTPExpiryTime(10)
    };
    await user.save();

    await sendOTPEmail(user.email, user.name, otpCode);

    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    next(error);
  }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account with that email' });
    }

    const otpCode = generateOTP();
    user.otp = {
      code: otpCode,
      expiresAt: getOTPExpiryTime(15) // 15 mins for password reset
    };
    await user.save();

    await sendResetPasswordEmail(user.email, user.name, otpCode);

    res.status(200).json({ success: true, message: 'Password reset OTP sent to email' });
  } catch (error) {
    next(error);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const check = verifyOTP(user, code);
    if (!check.valid) {
      return res.status(400).json({ success: false, message: check.message });
    }

    user.password = newPassword;
    user.otp = undefined; // clear otp
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

// Refresh Token
exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'anothersecretkeyforrefreshingtokens');
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid token or inactive account' });
    }

    const newAccessToken = generateAccessToken(user._id);

    // Set the new access token in cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax'
    };
    res.cookie('token', newAccessToken, cookieOptions);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// Logout
exports.logout = async (req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax'
  };
  
  res.clearCookie('token', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
