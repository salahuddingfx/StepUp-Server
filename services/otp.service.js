const generateOTP = () => {
  // Generate a random 6-digit numeric string
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOTPExpiryTime = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

const verifyOTP = (user, code) => {
  if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
    return { valid: false, message: 'No OTP generated for this user' };
  }

  if (user.otp.expiresAt < new Date()) {
    return { valid: false, message: 'OTP has expired' };
  }

  if (user.otp.code !== code) {
    return { valid: false, message: 'Invalid OTP code' };
  }

  return { valid: true };
};

module.exports = {
  generateOTP,
  getOTPExpiryTime,
  verifyOTP
};
