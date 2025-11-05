const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your app password
  }
});

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'PLSP COE Repository - Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a8a; color: white; padding: 2rem; text-align: center;">
          <h1>PLSP College of Engineering</h1>
          <h2>Repository System</h2>
        </div>
        
        <div style="padding: 2rem; background: #f8fafc;">
          <h3 style="color: #1e3a8a;">Password Reset Request</h3>
          <p>You have requested to reset your password for the PLSP COE Repository System.</p>
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${resetUrl}" 
               style="background: #f97316; color: white; padding: 1rem 2rem; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 0.9rem;">
            This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
          </p>
          
          <p style="color: #64748b; font-size: 0.9rem;">
            If the button doesn't work, copy and paste this link: <br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 1rem; text-align: center; font-size: 0.9rem;">
          © 2025 Pamantasan ng Lungsod ng San Pablo - College of Engineering
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPasswordResetEmail };
