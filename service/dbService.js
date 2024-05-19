
const db = require('../config/db')

const getBroadcastData = async () => {
    const conn = await db();
    try {
        const [rows] = await conn.query(`
            SELECT
                bc.CusID,
                b.BFrom,
                b.BSubject,
                t.TContent,
                c.CusEmail
            FROM
                broadcast_customer bc
            JOIN broadcasts b ON bc.BID = b.BID
            JOIN templates t ON b.TID = t.TID
            JOIN customers c ON bc.CusID = c.CusID
            WHERE
                b.BStatus = 'Sent' AND
                c.CusIsDelete = 0 AND
                b.BIsDelete = 0
        `);
        return rows;
    } catch(error){
        console.log(error)
    }
};

module.exports = {
    getBroadcastData,
};
