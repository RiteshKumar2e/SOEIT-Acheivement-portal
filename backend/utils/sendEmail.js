const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        let transporter;

        // Use SMTP if configured
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.BREVO_API_KEY,
                },
            });
        } else {
            console.log('--- EMAIL SIMULATION ---');
            console.log('To:', options.to);
            console.log('Subject:', options.subject);
            return;
        }

        const message = {
            from: `${process.env.FROM_NAME || 'SOEIT Portal'} <${process.env.FROM_EMAIL || 'no-reply@soeit.edu.in'}>`,
            to: options.to,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        const info = await transporter.sendMail(message);
        console.log('📧 Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('❌ Email failed to send:', error.message);
    }
};

module.exports = sendEmail;
