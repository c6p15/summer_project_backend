const transporter = require('../config/nodemailerConfig');

const sendEmail = async ({ recipients, subject, message }) => {
    try {
        await transporter.sendMail({
            from: 'noreply@example.com',
            to: recipients,
            subject,
            html: `<b>${message}</b>`,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to handle it in the controller
    }
};

module.exports = {
    sendEmail
};
