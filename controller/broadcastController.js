
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

        const [checkResult] = await conn.query('SELECT BName, BStatus, BTag, Start_BSchedule, End_BSchedule FROM broadcasts WHERE AID = ? AND BIsDelete = 0', admin.AID)

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

module.exports = {
    getBroadcasts,
    getBroadcastById,
    createBroadcast,


}