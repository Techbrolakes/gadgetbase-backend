"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const pug = require('pug');
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
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
transporter.verify((error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Server is ready to take our messages');
    }
});
const verifyOtpMail = async ({ subject = '', email, name, otp }) => {
    const templatePath = path_1.default.join(__dirname, '../views/verify.pug');
    const compiledTemplate = pug.compileFile(templatePath);
    const html = compiledTemplate({ name, otp });
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        html: html,
    };
    try {
        await transporter.sendMail(mailOptions);
        return;
    }
    catch (error) {
        console.log(error);
    }
};
const welcomeEmail = async ({ subject = '', email, name }) => {
    const templatePath = path_1.default.join(__dirname, '../views/welcome.pug');
    const compiledTemplate = pug.compileFile(templatePath);
    const html = compiledTemplate({ name });
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        html: html,
    };
    try {
        await transporter.sendMail(mailOptions);
        return;
    }
    catch (error) {
        console.log(error);
    }
};
const mailService = {
    welcomeEmail,
    verifyOtpMail,
};
exports.default = mailService;
