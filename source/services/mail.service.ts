import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { ISendMail } from '../interfaces/email.interface';
import path from 'path';
const pug = require('pug');

dotenv.config();

// Nodemail Smtp Transporter Config
const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST, // use SSL
   port: 465,
   secure: true,
   auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
   },
   tls: {
      rejectUnauthorized: false,
   },
});

// test transporter connection
transporter.verify((error) => {
   if (error) {
      console.log(error);
   } else {
      console.log('Server is ready to take our messages');
   }
});

const verifyOtpMail = async ({ subject = '', email, name, otp }: ISendMail) => {
   const templatePath = path.join(__dirname, '../views/verify.pug');
   const compiledTemplate = pug.compileFile(templatePath);
   const html = compiledTemplate({ name, otp });

   const mailOptions = {
      from: process.env.SMTP_USER as string,
      to: email,
      subject: subject,
      html: html,
   };

   try {
      await transporter.sendMail(mailOptions);
      return;
   } catch (error) {
      console.log(error);
   }
};

const welcomeEmail = async ({ subject = '', email, name }: any) => {
   const templatePath = path.join(__dirname, '../views/welcome.pug');
   const compiledTemplate = pug.compileFile(templatePath);
   const html = compiledTemplate({ name });

   const mailOptions = {
      from: process.env.SMTP_USER as string,
      to: email,
      subject: subject,
      html: html,
   };

   try {
      await transporter.sendMail(mailOptions);
      return;
   } catch (error) {
      console.log(error);
   }
};

const mailService = {
   welcomeEmail,
   verifyOtpMail,
};

export default mailService;
