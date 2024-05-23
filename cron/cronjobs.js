
const cron = require('node-cron');
const transporter = require('../config/nodemailerConfig')

// every midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format
        const sql = `SELECT BID, BRecipient, TID, BFrom, BSubject FROM broadcasts WHERE BSchedule = ? AND BStatus = 'Schedule'`;
        const [broadcasts] = await conn.query(sql, [currentDate]);

        if (broadcasts.length === 0) {
            console.log('No scheduled broadcasts for today');
            return;
        }

        await conn.beginTransaction();

        for (const broadcast of broadcasts) {
            const [templateResult] = await conn.query('SELECT TContent FROM templates WHERE TID = ?', [broadcast.TID]);
            const templateContent = templateResult[0].TContent;

            let recipientQuery;
            let recipients;

            if (broadcast.BRecipient.toLowerCase() === 'everyone') {
                recipientQuery = 'SELECT CusID, CusEmail FROM customers WHERE CusIsDelete = 0';
                [recipients] = await conn.query(recipientQuery);
            } else if (broadcast.BRecipient.includes('@')) {
                recipientQuery = 'SELECT CusID, CusEmail FROM customers WHERE CusEmail = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientQuery, [broadcast.BRecipient]);
            } else {
                const levels = broadcast.BRecipient.split(',').map(level => level.trim());
                recipientQuery = 'SELECT CusID, CusEmail FROM customers WHERE CusLevel IN (?) AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientQuery, [levels]);
            }

            if (recipients.length === 0) {
                console.log(`No recipients found for broadcast with BID ${broadcast.BID}`);
                continue;
            }

            // Send email to each recipient
            for (const recipient of recipients) {
                const mailOptions = {
                    from: broadcast.BFrom,
                    to: recipient.CusEmail,
                    subject: broadcast.BSubject,
                    html: templateContent // Use the template content for email body
                };

                await transporter.sendMail(mailOptions);
                
                // Insert into broadcast_customer table
                await conn.query('INSERT INTO broadcast_customer (BID, CusID) VALUES (?, ?)', [broadcast.BID, recipient.CusID]);
            }

            // Update BStatus to 'Sent'
            await conn.query('UPDATE broadcasts SET BStatus = ? WHERE BID = ?', ['Sent', broadcast.BID]);
        }

        await conn.commit();

        console.log('Emails sent for scheduled broadcasts:', broadcasts.length);
    } catch (error) {
        await conn.rollback();
        console.error('Error occurred while processing scheduled broadcasts:', error);
    }
});

console.log('Cron job scheduled to run at midnight');