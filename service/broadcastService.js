
const checkRecipients = async (BRecipient, AID, conn) => {
    let recipientQuery
    let recipients

    try {
        if (BRecipient.toLowerCase() === 'everyone') {
            recipientQuery = 'SELECT CusID FROM customers WHERE AID = ? AND CusIsDelete = 0'
            [recipients] = await conn.query(recipientQuery, [AID])
        } else if (BRecipient.includes('@')) {
            recipientQuery = 'SELECT CusID FROM customers WHERE CusEmail = ? AND AID = ? AND CusIsDelete = 0'
            [recipients] = await conn.query(recipientQuery, [BRecipient, AID])
        } else {
            const levels = BRecipient.split(',').map(level => level.trim())
            recipientQuery = 'SELECT CusID FROM customers WHERE CusLevel IN (?) AND AID = ? AND CusIsDelete = 0'
            [recipients] = await conn.query(recipientQuery, [levels, AID])
        }

        return recipients
    } catch (error) {
        console.error('Error retrieving recipients:', error)
        throw error
    }
}

module.exports = {
    checkRecipients
}
