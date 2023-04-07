"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordRecoveryEmail = exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const mailgen_1 = __importDefault(require("mailgen"));
dotenv_1.default.config();
const mailGenerator = new mailgen_1.default({
    theme: 'cerberus',
    product: {
        name: 'GadgetBase',
        link: 'https://www.linkedin.com/in/lekandar/',
    },
});
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
const sendWelcomeEmail = async ({ subject = '', email, name, otp }) => {
    const welcomeTemplate = mailGenerator.generate({
        body: {
            name,
            intro: "Welcome to GadgetBase! We're very excited to have you on board.",
            action: {
                instructions: `To get started with your account, Please use the code below to verify your email ${email}, It will expiry in 15 minutes`,
                button: {
                    color: '#336B6B',
                    text: `${otp}`,
                    link: '#',
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    });
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        html: welcomeTemplate,
    };
    try {
        await transporter.sendMail(mailOptions);
        return;
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendPasswordRecoveryEmail = async ({ subject = '', email, name, otp }) => {
    const passwordRecoveryTemplate = mailGenerator.generate({
        body: {
            name,
            intro: 'Verification Needed',
            action: {
                instructions: `To recover your account 🔒 , please use the following code — it will expire in 15 minutes ⏰ :`,
                button: {
                    color: '#336B6B',
                    text: `${otp}`,
                    link: '#',
                },
            },
            outro: 'If you did not make this request, please contact us or ignore this message..',
        },
    });
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        html: passwordRecoveryTemplate,
    };
    try {
        await transporter.sendMail(mailOptions);
        return;
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendPasswordRecoveryEmail = sendPasswordRecoveryEmail;
