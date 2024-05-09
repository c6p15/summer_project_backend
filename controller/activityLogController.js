require('dotenv').config()

const getActivityLogs = async (req, res) => {
    try {
        const admin = req.admin;
        const { offset, limit, page } = req.pagination;

        // Query to count total activity logs
        const countQuery = 'SELECT COUNT(*) AS totalCount FROM broadcasts b JOIN templates t ON b.TID = t.TID JOIN broadcast_customer bc ON b.BID = bc.BID JOIN admins a ON b.AID = a.AID WHERE a.AID = ?';
        const [countResult] = await conn.query(countQuery, [admin.AID]);
        const totalCount = countResult && countResult.length > 0 ? countResult[0].totalCount : 0;

        // Query to fetch paginated results
        const [activityResults] = await conn.query('SELECT b.BName, t.TName, bc.BCDatetime, b.BRecipient, a.AID FROM broadcasts b JOIN templates t ON b.TID = t.TID JOIN broadcast_customer bc ON b.BID = bc.BID JOIN admins a ON b.AID = a.AID WHERE a.AID = ? LIMIT ?, ?', [admin.AID, offset, limit]);

        res.json({
            message: 'show activity logs successfully!!',
            activityLogs: activityResults,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit) // Calculate total pages based on totalCount
        });

    } catch (error) {
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        });
    }
};


module.exports ={
    getActivityLogs
}