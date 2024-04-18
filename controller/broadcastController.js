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
        const [results] = await conn.query(sql, [
            broadcastData.BName,
            broadcastData.BStatus,
            broadcastData.BTag,
            broadcastData.BFrom,
            broadcastData.BRecipient,
            broadcastData.BSubject,
            broadcastData.TID,
            admin.AID
        ]);
        const insertedBID = results.insertId;

        try {
            if (broadcastData.BRecipient === 'everyone') {
                const fetchEveryone = 'SELECT CusID FROM customers WHERE AID = ? AND CusIsDelete = 0';
                const [allCustomers] = await conn.query(fetchEveryone, [admin.AID]);
        
                for (const customer of allCustomers) {
                    await conn.query('INSERT INTO broadcast_customer (BID, CusID) VALUES (?, ?)', [insertedBID, customer.CusID]);
                }
            } else if (typeof broadcastData.BRecipient === 'string' && broadcastData.BRecipient.includes(',')) {
                const levels = broadcastData.BRecipient.split(',').map(level => level.trim());
        
                for (const level of levels) {
                    const fetchByLevel = 'SELECT CusID FROM customers WHERE CusLevel = ? AND AID = ? AND CusIsDelete = 0';
                    const [customers] = await conn.query(fetchByLevel, [level, admin.AID]);
        
                    for (const customer of customers) {
                        await conn.query('INSERT INTO broadcast_customer (BID, CusID) VALUES (?, ?)', [insertedBID, customer.CusID]);
                    }
                }
            } else {
                const fetchEmail = 'SELECT CusID FROM customers WHERE CusEmail = ? AND AID = ? AND CusIsDelete = 0';
                const [customerResult] = await conn.query(fetchEmail, [broadcastData.BRecipient, admin.AID]);
        
                if (customerResult.length > 0) {
                    await conn.query('INSERT INTO broadcast_customer (BID, CusID) VALUES (?, ?)', [insertedBID, customerResult[0].CusID]);
                } else {
                    res.status(404).json({
                        message: 'Recipient not found',
                        error: 'The specified recipient email does not exist in the database.'
                    });
                    return;
                }
            }
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
            return;
        }
        

        res.json({
            message: 'Created broadcast successfully!!',
            broadcast: results
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
            broadcast: results
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