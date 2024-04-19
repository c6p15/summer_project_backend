require('dotenv').config()

const getActivityLogs = async (req, res) => {
    try {
        const admin = req.admin

        const [results] = await conn.query('SELECT b.BName, t.TName, bc.BCDatetime, b.BRecipient, a.AID FROM broadcasts b JOIN templates t ON b.TID = t.TID JOIN broadcast_customer bc ON b.BID = bc.BID JOIN admins a ON b.AID = a.AID WHERE a.AID = ?', admin.AID)

        res.json({
            message: 'show activity logs successfully!!',
            templates: results
        })

    } catch (error) {
        res.status(403).json({
            message: 'Authentication failed',
            error
        })
    }
}

module.exports ={
    getActivityLogs
}