
async function getRecipients(conn, BRecipient, AID) {
    let recipientQuery
    let recipients

    if (BRecipient.toLowerCase() === 'everyone') {
        recipientQuery = 'SELECT CusID FROM customers WHERE AID = ? AND CusIsDelete = 0'
        [recipients] = await conn.query(recipientQuery, [AID])
    } else if (BRecipient.includes('@')) {
        recipientQuery = 'SELECT CusID FROM customers WHERE CusEmail = ? AND AID = ? AND CusIsDelete = 0';
        [recipients] = await conn.query(recipientQuery, [BRecipient, AID])
    } else {
        const levels = BRecipient.split(',').map(level => level.trim())
        recipientQuery = 'SELECT CusID FROM customers WHERE CusLevel IN (?) AND AID = ? AND CusIsDelete = 0';
        [recipients] = await conn.query(recipientQuery, [levels, AID])
    }

    return recipients
}

module.exports = {
    getRecipients
}
