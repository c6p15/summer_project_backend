
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

        const [checkResult] = await conn.query('SELECT BName, BStatus, BTag, Start_BSchedule, End_BSchedule FROM broadcasts WHERE AID = ?', admin.AID)

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


        const [checkResult] = await conn.query('SELECT BName, BStatus, BTag, Start_BSchedule, End_BSchedule FROM broadcasts WHERE AID = ? AND BID = ? ', [admin.AID, req.params.BID])

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

module.exports = {
    getBroadcasts,
    getBroadcastById,

}