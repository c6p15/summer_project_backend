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

        const sql = ('SELECT CusID, CusName, CusEmail, CusLevel, Start_CusUpdateTime, End_CusUpdateTime FROM customers WHERE AID =? AND CusIsDelete = 0')

        const [results] = await conn.query(sql, admin.AID)

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

        const sql = ('SELECT CusID, CusName, CusEmail, CusLevel, Start_CusUpdateTime, End_CusUpdateTime FROM customers WHERE AID = ? AND CusID = ? AND CusIsDelete = 0 ')

        const [checkResult] = await conn.query(sql, [admin.AID, req.params.CusID])

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

const updateCustomer = async (req, res) => {
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

        const { CusName, CusEmail, CusLevel } = req.body
        const cusData = {
            CusName,
            CusEmail,
            CusLevel,
        }

        const sql = 'UPDATE customers SET CusName=?, CusEmail=?, CusLevel=? WHERE CusID=? AND AID=?'

        const [results] = await conn.query(sql, [cusData.CusName, cusData.CusEmail, cusData.CusLevel, req.params.CusID, admin.AID])

        res.json({
            message: 'Update Customer Successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Authentication fail',
            error
        })
    }
}

const deleteCustomer = async (req, res) => {
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

        const sql = 'UPDATE customers SET CusIsDelete=1 WHERE CusID=? AND AID=?'

        const [results] = await conn.query(sql, [req.params.CusID, admin.AID])

        res.json({
            message: 'Delete Customer Successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Authentication fail',
            error
        })
    }
}


module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,

}