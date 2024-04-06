require('dotenv').config()

const jwt = require('jsonwebtoken')

const getCustomers = async (req,res) => {
    try{
        const authHeader = req.headers['authorization']
        let authToken = ''
        if (authHeader) {
            authToken = authHeader.split(' ')[1]
        }
        const admin = jwt.verify(authToken, process.env.secret)
        console.log('admin', admin.AID)

        const [results] = await conn.query('SELECT CusID, CusName, CusEmail, CusLevel, Start_CusUpdateTime, End_CusUpdateTime FROM customers WHERE AID =? AND CusIsDelete = 0', admin.AID)

        res.json({
            message: 'Show Customers Successfully!!',
            customers: results
        })

    }catch(error){
        res.status(403).json({
            message: 'authentication fail',
            error
        })        
    }
}

const getCustomerById = async (req,res) => {
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

        const [checkResult] = await conn.query('SELECT CusID, CusName, CusEmail, CusLevel, Start_CusUpdateTime, End_CusUpdateTime FROM customers WHERE AID = ? AND CusID = ? AND CusIsDelete = 0 ', [admin.AID, req.params.CusID])

        res.json({
            message: 'Show Selected Customer Successfully!!',
            customer: checkResult
        })

    }catch(error){
        res.status(403).json({
            message: 'authentication fail',
            error
        })
    }
}

const createCustomer = async (req,res) =>{
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

        const { CusName , CusEmail, CusLevel } = req.body
        const cusData ={
            CusName,
            CusEmail,
            CusLevel,
            AID: admin.AID
        }
        
        const sql = ('INSERT INTO customers (`CusName`, `CusEmail`, `CusLevel`, `AID`) VALUES (?, ?, ?, ?)')

        const [results] = await conn.query(sql,[cusData.CusName, cusData.CusEmail, cusData.CusLevel, admin.AID])

        res.json({
            message: 'Create Customer Successfully!!',
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
    getCustomers,
    getCustomerById,
    createCustomer,

}