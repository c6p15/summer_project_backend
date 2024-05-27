const transporter = require('../config/nodemailerConfig')

require('dotenv').config()

const getBroadcaststest = async (req, res) => {
    try {
        const { offset, limit, page } = req.pagination;


        const countQuery = 'SELECT COUNT(*) AS totalCount FROM broadcasts WHERE BIsDelete = 0 AND (BSchedule IS NULL OR BSchedule <= NOW())';
        const [countResult] = await conn.query(countQuery);
        const totalCount = countResult && countResult.length > 0 ? countResult[0].totalCount : 0;
        
        const query = 'SELECT BID, BName, BStatus, BTag, BUpdate, BSchedule FROM broadcasts WHERE BIsDelete = 0 AND (BSchedule IS NULL OR BSchedule <= NOW()) LIMIT ?, ?';
        const [checkResult] = await conn.query(query, [ offset, limit]);

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
            totalPages: Math.ceil(totalCount / limit), // Calculate total pages based on total results and limit
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
        const { admin } = req; // Assuming admin is set in req by middleware
        const { status, daterange, tag, filter } = req.query;

        // Default pagination values
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        // Initialize condition and parameters array
        let condition = "AID = ? AND BIsDelete = 0 AND (BSchedule IS NULL OR BSchedule <= NOW())";
        const params = [admin.AID];
        let orderByClause = "";
        let joinClause = "";

        // Add conditions based on query parameters
        if (status) {
            const statuses = status.split(','); // Split multiple statuses by comma
            condition += " AND BStatus IN (?)"; // Use IN clause for multiple values
            params.push(statuses);
        }
        if (daterange) {
            const [startDate, endDate] = daterange.split(',');
            condition += " AND BUpdate BETWEEN ? AND ?";
            params.push(startDate, endDate);
        }
        if (tag) {
            const tags = tag.split(','); // Split multiple tags by comma
            condition += " AND BTag IN (?)"; // Use IN clause for multiple values
            params.push(tags);
        }

        // Add filter-based conditions
        switch (filter) {
            case 'Last Update':
                orderByClause = "ORDER BY BUpdate DESC";
                break;
            case 'Email Sent':
                condition += " AND BRecipient LIKE '%@%'";
                break;
            case 'Date Sent':
                joinClause = "JOIN broadcast_customer AS bc ON broadcasts.BID = bc.BID";
                orderByClause = "ORDER BY bc.BCDatetime DESC";
                break;
            case 'Name':
                orderByClause = `
                ORDER BY
                CASE 
                    WHEN BName >= 'A' AND BName <= 'Z' THEN 1
                    WHEN BName >= 'a' AND BName <= 'z' THEN 2
                    WHEN BName >= 'ก' AND BName <= 'ฮ' THEN 3
                END,
                BName COLLATE utf8mb4_bin
                `;
                break;
            default:
                break;
        }

        // Query to count total records
        const countQuery = `SELECT COUNT(*) AS totalCount FROM broadcasts ${joinClause} WHERE ${condition}`;
        const [countResult] = await conn.query(countQuery, params);
        const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

        // Add pagination parameters for data query
        params.push(offset, limit);

        // Query to fetch paginated results
        const dataQuery = `
            SELECT broadcasts.BID, BName, BStatus, BTag, BUpdate, BSchedule 
            FROM broadcasts
            ${joinClause}
            WHERE ${condition}
            ${orderByClause}
            LIMIT ?, ?
        `;
        const [dataResult] = await conn.query(dataQuery, params);

        // Map the results to a formatted broadcasts array
        const broadcasts = dataResult.map(broadcast => ({
            BID: broadcast.BID,
            BName: broadcast.BName,
            BStatus: broadcast.BStatus,
            BTag: broadcast.BTag,
            BUpdate: broadcast.BUpdate,
            ...(broadcast.BSchedule !== null && { BSchedule: broadcast.BSchedule })
        }));

        // Respond with the results
        res.json({
            message: 'Show broadcasts successfully!!',
            broadcasts,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        // Handle errors and respond with a 500 status code
        res.status(500).json({
            message: 'Failed to fetch broadcasts',
            error: error.message,
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

const createBroadcast = async (req, res) => {
    try {
        const { BName, BSchedule, BTag, BFrom, BRecipient, BSubject, TID } = req.body;
        const { AID } = req.admin;

        let BStatus;
        if (!BName || !BTag || !BFrom || !BRecipient || !BSubject || !TID) {
            BStatus = 'Draft';
        } else if (BSchedule) {
            BStatus = 'Schedule';
        } else {
            BStatus = 'Sent';
        }

        await conn.beginTransaction();

        const sql = 'INSERT INTO broadcasts (BName, BStatus, BSchedule, BTag, BFrom, BRecipient, BSubject, TID, AID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [results] = await conn.query(sql, [BName, BStatus, BSchedule, BTag, BFrom, BRecipient, BSubject, TID, AID]);
        const insertedBID = results.insertId;

        if (BStatus === 'Sent') {
            const [templateResult] = await conn.query('SELECT TContent FROM templates WHERE TID = ?', [TID]);
            const templateContent = templateResult[0]?.TContent;

            if (!templateContent) {
                await conn.rollback();
                return res.status(404).json({ message: 'Template not found' });
            }

            let recipientsQuery, recipients;

            if (BRecipient.toLowerCase() === 'everyone') {
                recipientsQuery = 'SELECT CusID, CusEmail FROM customers WHERE AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientsQuery, [AID]);
            } else if (BRecipient.includes('@')) {
                recipientsQuery = 'SELECT CusID, CusEmail FROM customers WHERE CusEmail = ? AND AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientsQuery, [BRecipient, AID]);
            } else {
                const levels = BRecipient.split(',').map(level => level.trim());
                recipientsQuery = 'SELECT CusID, CusEmail FROM customers WHERE CusLevel IN (?) AND AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientsQuery, [levels, AID]);
            }

            if (!recipients.length) {
                await conn.rollback();
                return res.status(404).json({ message: 'Recipients not found' });
            }

            for (const recipient of recipients) {
                const mailOptions = {
                    from: `"${BFrom}" <noreply@example.com>`,
                    to: recipient.CusEmail,
                    subject: BSubject,
                    html: templateContent
                };

                try {
                    await transporter.sendMail(mailOptions);
                    await conn.query('INSERT INTO broadcast_customer (BID, CusID) VALUES (?, ?)', [insertedBID, recipient.CusID]);
                } catch (emailError) {
                    console.error('Email send error:', emailError);
                }
            }
        }

        await conn.commit();

        res.json({
            message: 'Created and sent broadcast successfully!',
            broadcastId: insertedBID
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
        const { BName, BSchedule, BTag, BFrom, BRecipient, BSubject, TID } = req.body;
        const { AID } = req.admin;
        const { BID } = req.params;

        let BStatus;
        if (!BName || !BTag || !BFrom || !BRecipient || !BSubject || !TID) {
            BStatus = 'Draft';
        } else if (BSchedule) {
            BStatus = 'Schedule';
        } else {
            BStatus = 'Sent';
        }

        const broadcastData = {
            BName,
            BStatus,
            BSchedule,
            BTag,
            BFrom,
            BRecipient,
            BSubject,
            TID
        };

        await conn.beginTransaction();

        const sql = 'UPDATE broadcasts SET BName=?, BStatus=?, BSchedule=?, BTag=?, BFrom=?, BRecipient=?, BSubject=?, TID=? WHERE BID=? AND AID=?';
        const [results] = await conn.query(sql, [broadcastData.BName, broadcastData.BStatus, broadcastData.BSchedule, broadcastData.BTag, broadcastData.BFrom, broadcastData.BRecipient, broadcastData.BSubject, broadcastData.TID, BID, AID]);

        if (BStatus === 'Sent') {
            const [templateResult] = await conn.query('SELECT TContent FROM templates WHERE TID = ?', [TID]);
            const templateContent = templateResult[0]?.TContent;

            if (!templateContent) {
                await conn.rollback();
                return res.status(404).json({ message: 'Template not found' });
            }

            let recipientsQuery, recipients;

            if (BRecipient.toLowerCase() === 'everyone') {
                recipientsQuery = 'SELECT CusID, CusEmail FROM customers WHERE AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientsQuery, [AID]);
            } else if (BRecipient.includes('@')) {
                recipientsQuery = 'SELECT CusID, CusEmail FROM customers WHERE CusEmail = ? AND AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientsQuery, [BRecipient, AID]);
            } else {
                const levels = BRecipient.split(',').map(level => level.trim());
                recipientsQuery = 'SELECT CusID, CusEmail FROM customers WHERE CusLevel IN (?) AND AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientsQuery, [levels, AID]);
            }

            if (!recipients.length) {
                await conn.rollback();
                return res.status(404).json({ message: 'Recipients not found' });
            }

            for (const recipient of recipients) {
                const mailOptions = {
                    from: `"${BFrom}" <noreply@example.com>`,
                    to: recipient.CusEmail,
                    subject: BSubject,
                    html: templateContent
                };

                try {
                    await transporter.sendMail(mailOptions);
                    await conn.query('INSERT INTO broadcast_customer (BID, CusID) VALUES (?, ?) ON DUPLICATE KEY UPDATE CusID = CusID', [BID, recipient.CusID]);
                } catch (emailError) {
                    console.error('Email send error:', emailError);
                }
            }
        }

        await conn.commit();

        res.json({
            message: 'Updated broadcast successfully!',
            broadcast: results
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

const duplicateBroadcast = async (req, res) => {
    try {
        const { AID } = req.admin;
        const { BID } = req.params;

        const [existingBroadcastResult] = await conn.query('SELECT * FROM broadcasts WHERE BID = ?', [BID]);

        if (existingBroadcastResult.length === 0) {
            return res.status(404).json({ message: 'Broadcast not found' });
        }

        const existingBroadcast = existingBroadcastResult[0];

        const [duplicateNameExists] = await conn.query('SELECT COUNT(*) AS count FROM broadcasts WHERE BName = ?', [existingBroadcast.BName]);

        let newName = existingBroadcast.BName;
        if (duplicateNameExists[0].count > 0) {
            newName = `${existingBroadcast.BName}_duplicate`;
        }

        // Determine BStatus based on the given conditions
        let BStatus;
        if (!existingBroadcast.BName || !existingBroadcast.BTag || !existingBroadcast.BFrom || !existingBroadcast.BRecipient || !existingBroadcast.BSubject || !existingBroadcast.TID) {
            BStatus = 'Draft';
        } else if (existingBroadcast.BSchedule) {
            BStatus = 'Schedule';
        } else {
            BStatus = 'Sent';
        }

        await conn.beginTransaction();

        const sql = 'INSERT INTO broadcasts (BName, BStatus, BSchedule, BTag, BFrom, BRecipient, BSubject, TID, AID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [results] = await conn.query(sql, [newName, BStatus, existingBroadcast.BSchedule, existingBroadcast.BTag, existingBroadcast.BFrom, existingBroadcast.BRecipient, existingBroadcast.BSubject, existingBroadcast.TID, AID]);
        const newBID = results.insertId;

        if (BStatus === 'Sent') {
            const [templateResult] = await conn.query('SELECT TContent FROM templates WHERE TID = ?', [existingBroadcast.TID]);
            const templateContent = templateResult[0]?.TContent;

            if (!templateContent) {
                await conn.rollback();
                return res.status(404).json({ message: 'Template not found' });
            }

            let recipientsQuery, recipients;

            if (existingBroadcast.BRecipient.toLowerCase() === 'everyone') {
                recipientsQuery = 'SELECT CusID, CusEmail FROM customers WHERE AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientsQuery, [AID]);
            } else if (existingBroadcast.BRecipient.includes('@')) {
                recipientsQuery = 'SELECT CusID, CusEmail FROM customers WHERE CusEmail = ? AND AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientsQuery, [existingBroadcast.BRecipient, AID]);
            } else {
                const levels = existingBroadcast.BRecipient.split(',').map(level => level.trim());
                recipientsQuery = 'SELECT CusID, CusEmail FROM customers WHERE CusLevel IN (?) AND AID = ? AND CusIsDelete = 0';
                [recipients] = await conn.query(recipientsQuery, [levels, AID]);
            }

            if (!recipients.length) {
                await conn.rollback();
                return res.status(404).json({ message: 'Recipients not found' });
            }

            for (const recipient of recipients) {
                const mailOptions = {
                    from: `"${existingBroadcast.BFrom}" <noreply@example.com>`,
                    to: recipient.CusEmail,
                    subject: existingBroadcast.BSubject,
                    html: templateContent
                };

                try {
                    await transporter.sendMail(mailOptions);
                    await conn.query('INSERT INTO broadcast_customer (BID, CusID) VALUES (?, ?)', [newBID, recipient.CusID]);
                } catch (emailError) {
                    console.error('Email send error:', emailError);
                }
            }
        }

        await conn.commit();

        res.json({
            message: 'Duplicated broadcast successfully!',
            broadcastId: newBID
        });
    } catch (error) {
        await conn.rollback();
        console.error('Error occurred:', error);
        res.status(500).json({
            message: 'Duplicate failed :(',
            error: error.message
        });
    }
};


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


module.exports = {
    getBroadcasts,
    getBroadcastById,
    createBroadcast,
    updateBroadcast,
    duplicateBroadcast,
    deleteBroadcast,
    getBroadcastById,
    getBroadcaststest
}
