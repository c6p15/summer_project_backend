
require('dotenv').config()
const jwt = require('jsonwebtoken')



const getBroadcasts = async (req,res) => {
    try{
        const authHeader = req.headers['authorization']
        console.log(authHeader)
        let authToken = ''
        if (authHeader) {
            authToken = authHeader.split(' ')[1]
        }
        console.log(authToken)
        const admin = jwt.verify(authToken, process.env.secret)
        console.log('admin', admin.AID)

        const [checkResult] = await conn.query('SELECT BID, BName, BStatus, BTag, Start_BSchedule, End_BSchedule FROM broadcasts WHERE AID = ? AND BIsDelete = 0', admin.AID)

        res.json({
            message: 'Show Broadcasts Successfully!!',            
            broadcasts: checkResult
        })


    }catch(error){
        res.status(403).json({
            message: 'authentication fail',
            error
        })        
    }

}

const getBroadcastById = async (req,res) => {
    try{
        const authHeader = req.headers['authorization']
        console.log(authHeader)
        let authToken = ''
        if (authHeader) {
            authToken = authHeader.split(' ')[1]
        }
        console.log(authToken)
        const admin = jwt.verify(authToken, process.env.secret)
        console.log('admin', admin.AID)


        const [checkResult] = await conn.query('SELECT BName, BStatus, BTag, Start_BSchedule, End_BSchedule FROM broadcasts WHERE AID = ? AND BID = ? AND BIsDelete = 0', [admin.AID, req.params.BID])

        res.json({
            message: 'Show Selected Broadcast Successfully!!',
            broadcast: checkResult
        })

    }catch(error){
        res.status(403).json({
            message: 'authentication fail',
            error
        })        
    }
}

const createBroadcast = async (req,res) =>{
    try{
        const authHeader = req.headers['authorization']
        console.log(authHeader)
        let authToken = ''
        if (authHeader) {
            authToken = authHeader.split(' ')[1]
        }
        console.log(authToken)
        const admin = jwt.verify(authToken, process.env.secret)
        console.log('admin', admin.AID)

        const { BName , BStatus, BTag, BFrom, BRecipient, BSubject,TID } = req.body
        const broadcastData ={
            BName,
            BStatus,
            BTag,
            BFrom,
            BRecipient,
            BSubject,
            TID,
            AID: admin.AID
        }
        
        const sql = ('INSERT INTO broadcasts (`BName`,`BStatus`,`BTag`,`BFrom`,`BRecipient`, `BSubject`, `TID` ,`AID`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')

        const [results] = await conn.query(sql,[broadcastData.BName, broadcastData.BStatus, broadcastData.BTag, broadcastData.BFrom,broadcastData.BRecipient, broadcastData.BSubject, broadcastData.TID, admin.AID])

        res.json({
            message: 'Create Broadcast Successfully!!',
            template: results
        })
    }catch(error){
        res.status(403).json({
            message: 'authentication fail',
            error
        })
    }
}

const updateBroadcast = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        console.log(authHeader)
        let authToken = ''
        if (authHeader) {
            authToken = authHeader.split(' ')[1]
        }
        console.log(authToken)
        const admin = jwt.verify(authToken, process.env.secret)
        console.log('admin', admin.AID)

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
            message: 'Update Broadcast Successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'authentication fail',
            error
        })
    }
}

const duplicateBroadcast = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        console.log(authHeader)
        let authToken = ''
        if (authHeader) {
            authToken = authHeader.split(' ')[1]
        }
        console.log(authToken)
        const admin = jwt.verify(authToken, process.env.secret)
        console.log('admin', admin.AID)

        const [existingBroadcast] = await conn.query('SELECT * FROM broadcasts WHERE BID = ?', [req.params.BID])

        const [duplicateNameExists] = await conn.query('SELECT COUNT(*) AS count FROM broadcasts WHERE BName = ?', [existingBroadcast[0].BName])

        let newName = existingBroadcast[0].BName

        if (duplicateNameExists[0].count > 0) {
            newName = existingBroadcast[0].BName + '_duplicate'
        }

        const sql = 'INSERT INTO broadcasts (BName, BStatus, BTag, BFrom, BRecipient, BSubject, TID, AID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

        const [results] = await conn.query(sql, [newName, existingBroadcast[0].BStatus, existingBroadcast[0].BTag, existingBroadcast[0].BFrom, existingBroadcast[0].BRecipient, existingBroadcast[0].BSubject, existingBroadcast[0].TID, admin.AID])

        res.json({
            message: 'Duplicate Broadcast Successfully!!',
            template: results
        })
    } catch (error) {
        res.json({
            message: 'Duplicate fail :(',
            error
        })
    }
}

const deleteBroadcast = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        console.log(authHeader)
        let authToken = ''
        if (authHeader) {
            authToken = authHeader.split(' ')[1]
        }
        console.log(authToken)
        const admin = jwt.verify(authToken, process.env.secret)
        console.log('admin', admin.AID)

        const sql = 'UPDATE broadcasts SET BIsDelete=1 WHERE BID=? AND AID=?'
        const [results] = await conn.query(sql, [req.params.BID, admin.AID])

        res.json({
            message: 'Delete Broadcast Successfully!!',
            template: results
        })
    } catch (error) {
        res.json({
            message: 'Delete fail :(',
            error
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
    
}