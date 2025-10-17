import nodemailer from 'nodemailer';
import { ENV } from '../config';

const sendEmail = async (mailBody: {
  to: string;
  subject: string;
  message?: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: ENV.envMode === 'production', // true for 465, false for other ports
    auth: {
      user: ENV.mailEmail,
      pass: ENV.mailPassword,
    },
  });
  await transporter.sendMail({
    from: `"UI-UX-Design-Portfolio" <${ENV.mailEmail}>`, // sender address
    ...mailBody,
  });
};

export default sendEmail;
