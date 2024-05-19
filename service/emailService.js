const transporter = require('../testing/nodemailerConfig'); // Adjust the path as necessary

const sendEmail = async ({ from, to, subject, html }) => {
    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });
        console.log(`Email sent successfully to: ${to}`);
    } catch (error) {
        console.error(`Error sending email to: ${to}, Error: ${error.message}`);
        throw error;
    }
};

const sendBulkEmails = async (emails) => {
    for (const email of emails) {
        await sendEmail(email);
    }
};

module.exports = {
    sendEmail,
    sendBulkEmails,
};
