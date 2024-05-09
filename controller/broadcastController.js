
require('dotenv').config()

// const { validateBName } = require('../../frontend/summer_project/src/validator/broadcastValidator')

const getBroadcaststest = async (req, res) => {
    try {
        const { offset, limit, page } = req.pagination;

        const [checkResult] = await conn.query('SELECT BID, BName, BStatus, BTag, BUpdate, BSchedule FROM broadcasts WHERE BIsDelete = 0 AND (BSchedule IS NULL OR BSchedule <= NOW()) LIMIT ?, ?', [offset, limit]);

        res.json({
            message: 'Show broadcasts successfully!!',
            broadcasts: checkResult.map(broadcast => ({
                BID: broadcast.BID,
                BName: broadcast.BName,
                BStatus: broadcast.BStatus,
                BTag: broadcast.BTag,
                BUpdate: broadcast.BUpdate,
                ...(broadcast.BSchedule !== null && { BSchedule: broadcast.BSchedule }) // Conditionally include BSchedule if not null
            })),
            currentPage: page,
            totalPages: Math.ceil(checkResult.length / limit), // Calculate total pages based on total results and limit
        });
    } catch(error) {
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        });        
    }
};

const getBroadcasts = async (req, res) => {
    try {
        const admin = req.admin
        const { offset, limit, page } = req.pagination;

        const [checkResult] = await conn.query('SELECT BID, BName, BStatus, BTag, BUpdate, BSchedule FROM broadcasts WHERE AID = ? AND BIsDelete = 0 AND (BSchedule IS NULL OR BSchedule <= NOW()) LIMIT ?, ?', [admin.AID, offset, limit]);

        res.json({
            message: 'Show broadcasts successfully!!',
            broadcasts: checkResult.map(broadcast => ({
                BID: broadcast.BID,
                BName: broadcast.BName,
                BStatus: broadcast.BStatus,
                BTag: broadcast.BTag,
                BUpdate: broadcast.BUpdate,
                ...(broadcast.BSchedule !== null && { BSchedule: broadcast.BSchedule })
            })),
            currentPage: page,
            totalPages: Math.ceil(checkResult.length / limit)
        });
    } catch(error) {
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        });        
    }
};

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

// add insert BSchedule

const createBroadcast = async (req, res) => {
    try {
        const { BName, BStatus, BSchedule, BTag, BFrom, BRecipient, BSubject, TID } = req.body;
        const { AID } = req.admin;

        if (validateBName(BName) !== true) {
            return res.status(400).json({ message: validateBName(BName) });
        }

        await conn.beginTransaction();

        const sql = 'INSERT INTO broadcasts (BName, BStatus, BSchedule, BTag, BFrom, BRecipient, BSubject, TID, AID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [results] = await conn.query(sql, [BName, BStatus, BSchedule, BTag, BFrom, BRecipient, BSubject, TID, AID]);
        const insertedBID = results.insertId;

        let broadcastCustomers = [];

        if (BStatus === 'Sent') { // Check if BStatus is 'Sent'
            let recipientQuery;
            let recipients;

            if (BRecipient.toLowerCase() === 'everyone') {
                recipientQuery = 'SELECT CusID FROM customers WHERE AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientQuery, [AID]);
            } else if (BRecipient.includes('@')) {
                recipientQuery = 'SELECT CusID FROM customers WHERE CusEmail = ? AND AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientQuery, [BRecipient, AID]);
            } else {
                const levels = BRecipient.split(',').map(level => level.trim());
                recipientQuery = 'SELECT CusID FROM customers WHERE CusLevel IN (?) AND AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientQuery, [levels, AID]);
            }

            if (recipients.length === 0) {
                await conn.rollback();
                return res.status(404).json({
                    message: 'Recipients not found',
                    error: 'The specified recipients do not exist in the database.',
                });
            }

            for (const recipient of recipients) {
                await conn.query('INSERT INTO broadcast_customer (BID, CusID) VALUES (?, ?)', [insertedBID, recipient.CusID]);
            }

            [broadcastCustomers] = await conn.query('SELECT * FROM broadcast_customer WHERE BID = ?', [insertedBID]);
        }

        const [createdBroadcast] = await conn.query('SELECT * FROM broadcasts WHERE BID = ?', [insertedBID]);

        await conn.commit();

        res.json({
            message: 'Created broadcast successfully!!',
            broadcast: createdBroadcast,
            broadcastCustomers: broadcastCustomers
        });
    } catch (error) {
        await conn.rollback();
        console.error('Error occurred:', error);
        res.status(500).json({
            message: 'Error occurred',
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

const getBroadcastsbyDate = async (req,res) => {
    try {
        const admin = req.admin
        const { offset, limit, page } = req.pagination;

        //const Start_BUpdate & End_BUpdate รับค่าจาก Fronend

        const [checkResult] = await conn.query('SELECT * FROM broadcasts WHERE AID = ? AND BUpdate BETWEEN $Start_BUpdate AND $End_BUpdate LIMIT ?, ? ', [admin.AID, offset, limit])

        res.json({
            message: 'Show search Broadcasts successfully!!',
            broadcast: checkResult,
            currentPage: page,
            totalPages: Math.ceil(checkResult.length / limit),
        })
    } catch(error) {
        res.status(403).json({
            message: 'Search Broadcasts Date failed',
            error: error.message
        })        
    }
}

const getBroadcastsbyStatus = async (req,res) => {
    try {
        const admin = req.admin
        //const SearchBStatus รับค่าจาก Fronend

        const [checkResult] = await conn.query('SELECT * FROM broadcasts WHERE AID = ? AND BStatus LIKE '%SearchBStatus%' ;', [admin.AID])

        res.json({
            message: 'Show search Broadcasts Status successfully!!',
            broadcast: checkResult
        })
    } catch(error) {
        res.status(403).json({
            message: 'Search Broadcasts Status failed',
            error: error.message
        })        
    }
}

const getBroadcastsbyTag = async (req,res) => {
    try {
        const admin = req.admin
        //const SearchBTag รับค่าจาก Fronend

        const [checkResult] = await conn.query('SELECT * FROM broadcasts WHERE AID = ? AND BTag LIKE '%SearchBTag%' ;', [admin.AID])

        res.json({
            message: 'Show search Broadcasts tag successfully!!',
            broadcast: checkResult
        })
    } catch(error) {
        res.status(403).json({
            message: 'Search Broadcasts tag failed',
            error: error.message
        })        
    }
}

const getBroadcastsbyName = async (req,res) => {
    try {
        const admin = req.admin
        //const SearchBName รับค่าจาก Fronend

        const [checkResult] = await conn.query('SELECT * FROM broadcasts WHERE AID = ? AND BName LIKE '%SearchBName%' ;', [admin.AID])

        res.json({
            message: 'Show search Broadcasts name successfully!!',
            broadcast: checkResult
        })
    } catch(error) {
        res.status(403).json({
            message: 'Search Broadcasts name failed',
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
    getBroadcastsbyDate,
    getBroadcastsbyName,
    getBroadcastsbyStatus,
    getBroadcastsbyTag,
    getBroadcastById,
    getBroadcaststest
}
