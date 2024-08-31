import nodemailer from 'nodemailer';
import serverconfig from '../Config/serverconfig.js';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: serverconfig.appemail,
    pass: serverconfig.apppassword,
  },
});

export const sendPasswordChangeEmail = async (to, name) => {
  try {
    const info = await transporter.sendMail({
      from: serverconfig.appemail,
      to,
      subject: 'Password Change Notification',
      text: `Hello ${name},\n\n this mail from Buykart.Your password has been successfully changed.\n\nIf you did not request this change, please contact support immediately.\n\nBest regards,\nYour Team`,
      html: `<p>Hello ${name},</p><p>Your password has been successfully changed.</p><p>If you did not request this change, please contact support immediately.</p><p>Best regards,<br>Your Buykart Team</p>`,
    });

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
