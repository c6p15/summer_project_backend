
require('dotenv').config()
// controller/emailController.js

const { getBroadcastData } = require('../service/dbService'); // Adjust the path as necessary
const { sendBulkEmails } = require('../service/emailService');

const emailSend = async (req, res) => {
    try {
        
        // Fetch broadcast data
        const broadcastData = await getBroadcastData();

        // Prepare email details
        const emailDetails = broadcastData.map((data) => ({
            from: data.BFrom,
            to: data.CusEmail,
            subject: data.BSubject,
            html: data.TContent,
        }));

        // Send emails
        await sendBulkEmails(emailDetails);

        res.json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    emailSend,
};
