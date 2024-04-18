require('dotenv').config()

const getBroadcasts = async (req,res) => {
    try {
        const admin = req.admin

        const [checkResult] = await conn.query('SELECT BID, BName, BStatus, BTag, BUpdate FROM broadcasts WHERE AID = ? AND BIsDelete = 0', admin.AID)

        res.json({
            message: 'Show broadcasts successfully!!',
            broadcasts: checkResult
        })
    } catch(error) {
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        })        
    }
}

const getBroadcastById = async (req,res) => {
    try {
        const admin = req.admin

        const [checkResult] = await conn.query('SELECT BName, BStatus, BTag, BUpdate FROM broadcasts WHERE AID = ? AND BID = ? AND BIsDelete = 0', [admin.AID, req.params.BID])

        res.json({
            message: 'Show selected broadcast successfully!!',
            broadcast: checkResult
        })
    } catch(error) {
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        })        
    }
}

const createBroadcast = async (req, res) => {
    try {
        const admin = req.admin;

        const { BName, BStatus, BTag, BFrom, BRecipient, BSubject, TID } = req.body;
        const broadcastData = {
            BName,
            BStatus,
            BTag,
            BFrom,
            BRecipient,
            BSubject,
            TID,
            AID: admin.AID
        };

        const sql = 'INSERT INTO broadcasts (BName, BStatus, BTag, BFrom, BRecipient, BSubject, TID, AID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        const [results] = await conn.query(sql, [broadcastData.BName, broadcastData.BStatus, broadcastData.BTag, broadcastData.BFrom, broadcastData.BRecipient, broadcastData.BSubject, broadcastData.TID, admin.AID]);

        const insertedBID = results.insertId; // Get the inserted BID

        const addBroadcasts_Customers = `INSERT INTO broadcast_customer (BID, CusID) SELECT b.BID, c.CusID FROM broadcasts AS b JOIN customers AS c ON (FIND_IN_SET(c.CusLevel, REPLACE(b.BRecipient, '', '')) > 0) OR (TRIM(BOTH '{}' FROM b.BRecipient) = c.CusLevel) WHERE c.AID =? AND b.BID = ? AND c.CusIsDelete = 0 `;

        const [results_Broadcasts_Customers] = await conn.query(addBroadcasts_Customers, [admin.AID , insertedBID]); // Use insertedBID here

        res.json({
            message: 'Created broadcast successfully!!',
            template: results,
            results_Broadcasts_Customers
        });
    } catch (error) {
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        });
    }
};

const updateBroadcast = async (req, res) => {
    try {
        const admin = req.admin

        const { BName, BStatus, BTag, BFrom, BRecipient, BSubject, TID } = req.body

        const broadcastData = {
            BName,
            BStatus,
            BTag,
            BFrom,
            BRecipient,
            BSubject,
            TID
        }

        const sql = 'UPDATE broadcasts SET BName=?, BStatus=?, BTag=?, BFrom=?, BRecipient=?, BSubject=?, TID=? WHERE BID=? AND AID=?'

        const [results] = await conn.query(sql, [broadcastData.BName, broadcastData.BStatus, broadcastData.BTag, broadcastData.BFrom, broadcastData.BRecipient, broadcastData.BSubject, broadcastData.TID, req.params.BID, admin.AID])

        res.json({
            message: 'Updated broadcast successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        })
    }
}

const duplicateBroadcast = async (req, res) => {
    try {
        const admin = req.admin

        const [existingBroadcast] = await conn.query('SELECT * FROM broadcasts WHERE BID = ?', [req.params.BID])

        const [duplicateNameExists] = await conn.query('SELECT COUNT(*) AS count FROM broadcasts WHERE BName = ?', [existingBroadcast[0].BName])

        let newName = existingBroadcast[0].BName

        if (duplicateNameExists[0].count > 0) {
            newName = existingBroadcast[0].BName + '_duplicate'
        }

        const sql = 'INSERT INTO broadcasts (BName, BStatus, BTag, BFrom, BRecipient, BSubject, TID, AID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

        const [results] = await conn.query(sql, [newName, existingBroadcast[0].BStatus, existingBroadcast[0].BTag, existingBroadcast[0].BFrom, existingBroadcast[0].BRecipient, existingBroadcast[0].BSubject, existingBroadcast[0].TID, admin.AID])

        res.json({
            message: 'Duplicated broadcast successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Duplicate failed :(',
            error: error.message
        })
    }
}

const deleteBroadcast = async (req, res) => {
    try {
        const admin = req.admin

        const sql = 'UPDATE broadcasts SET BIsDelete=1 WHERE BID=? AND AID=?'
        const [results] = await conn.query(sql, [req.params.BID, admin.AID])

        res.json({
            message: 'Deleted broadcast successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Delete failed :(',
            error: error.message
        })
    }
}

const getSearchBroadcasts = async (req,res) => {
    try {
        const admin = req.admin

        const [checkResult] = await conn.query('SELECT * FROM broadcasts WHERE AID = ? AND BUpdate BETWEEN $Start_BUpdate AND $End_BUpdate ;', [admin.AID])

        res.json({
            message: 'Show search Broadcasts successfully!!',
            broadcast: checkResult
        })
    } catch(error) {
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        })        
    }
}

module.exports = {
    getBroadcasts,
    getBroadcastById,
    createBroadcast,
    updateBroadcast,
    duplicateBroadcast,
    deleteBroadcast,
    getSearchBroadcasts
}
