const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendEmail(targetEmail, content, subject = 'Export Playlist') {
        const message = {
            from: process.env.SMTP_USER,
            to: targetEmail,
            subject,
            text: content,
        };

        await this._transporter.sendMail(message);
    }
}

module.exports = MailSender;
