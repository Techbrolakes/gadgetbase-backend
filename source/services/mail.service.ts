import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Mailgen from 'mailgen';
import { ISendMail } from '../interfaces/email.interface';
dotenv.config();

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
    theme: 'cerberus',
    product: {
        name: 'GadgetBase',
        link: 'https://www.linkedin.com/in/lekandar/',
    },
});

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

// Functions to send different types of emails

export const sendWelcomeEmail = async ({ subject = '', email, name, otp }: ISendMail) => {
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
        from: process.env.SMTP_USER as string,
        to: email,
        subject: subject,
        html: welcomeTemplate,
    };

    try {
        await transporter.sendMail(mailOptions);
        return;
    } catch (error) {
        console.log(error);
    }
};

export const sendPasswordRecoveryEmail = async ({ subject = '', email, name, otp }: ISendMail) => {
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
        from: process.env.SMTP_USER as string,
        to: email,
        subject: subject,
        html: passwordRecoveryTemplate,
    };

    try {
        await transporter.sendMail(mailOptions);
        return;
    } catch (error) {
        console.log(error);
    }
};
