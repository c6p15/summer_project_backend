
const cron = require('node-cron');

// every midnight
cron.schedule('0 0 * * *', async () => {
  try {
      const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format
      const sql = `SELECT BID, BRecipient, BStatus FROM broadcasts WHERE BSchedule = ? AND BStatus = 'Schedule'`;
      const [broadcasts] = await conn.query(sql, [currentDate]);

      if (broadcasts.length === 0) {
          console.log('No broadcasts scheduled for midnight');
          return;
      }

      await conn.beginTransaction();

      for (const broadcast of broadcasts) {
          let recipientQuery;
          let recipients;

          if (broadcast.BRecipient.toLowerCase() === 'everyone') {
              recipientQuery = 'SELECT CusID FROM customers WHERE CusIsDelete = 0';
              [recipients] = await conn.query(recipientQuery);
          } else if (broadcast.BRecipient.includes('@')) {
              recipientQuery = 'SELECT CusID FROM customers WHERE CusEmail = ? AND CusIsDelete = 0';
              [recipients] = await conn.query(recipientQuery, [broadcast.BRecipient]);
          } else {
              const levels = broadcast.BRecipient.split(',').map(level => level.trim());
              recipientQuery = 'SELECT CusID FROM customers WHERE CusLevel IN (?) AND CusIsDelete = 0';
              [recipients] = await conn.query(recipientQuery, [levels]);
          }

          if (recipients.length === 0) {
              console.log(`No recipients found for broadcast with BID ${broadcast.BID}`);
              continue;
          }

          for (const recipient of recipients) {
              await conn.query('INSERT INTO broadcast_customer (BID, CusID) VALUES (?, ?)', [broadcast.BID, recipient.CusID]);
          }

          // Update BStatus to 'Sent'
          await conn.query('UPDATE broadcasts SET BStatus = ? WHERE BID = ?', ['Sent', broadcast.BID]);
      }

      await conn.commit();

      console.log('Inserted broadcast customers and updated status for midnight broadcasts:', broadcasts.length);
  } catch (error) {
      await conn.rollback();
      console.error('Error occurred while processing midnight broadcasts:', error);
  }
});

console.log('Cron job scheduled to run at midnight');