
require('dotenv').config()

const getCustomers = async (req, res) => {
    try {
        const admin = req.admin
        const { offset, limit, page } = req.pagination;

        const sql = 'SELECT CusID, CusName, CusEmail, CusLevel, CusUpdate FROM customers WHERE AID = ? AND CusIsDelete = 0 LIMIT ?, ?'

        const [customerResults] = await conn.query(sql, [admin.AID, offset, limit])

        res.json({
            message: 'Show customers successfully!',
            customers: customerResults,
            currentPage: page,
            totalPages: Math.ceil(customerResults.length / limit)
            
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const getCustomerById = async (req, res) => {
    try {
        const admin = req.admin

        const sql = 'SELECT CusID, CusName, CusEmail, CusLevel, CusUpdate FROM customers WHERE AID = ? AND CusID = ? AND CusIsDelete = 0'

        const [checkResult] = await conn.query(sql, [admin.AID, req.params.CusID])

        if (!checkResult.length) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        res.json({
            message: 'Show selected customer successfully!',
            customer: checkResult
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const createCustomer = async (req, res) => {
    try {
        const admin = req.admin

        const { CusName, CusEmail, CusLevel } = req.body
        const cusData = {
            CusName,
            CusEmail,
            CusLevel,
            AID: admin.AID
        }

        const sql = 'INSERT INTO customers (CusName, CusEmail, CusLevel, AID) VALUES (?, ?, ?, ?)'

        const [results] = await conn.query(sql, [cusData.CusName, cusData.CusEmail, cusData.CusLevel, admin.AID])

        res.json({
            message: 'Customer created successfully!',
            customer: results
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const updateCustomer = async (req, res) => {
    try {
        const admin = req.admin

        const { CusName, CusEmail, CusLevel } = req.body
        const cusData = {
            CusName,
            CusEmail,
            CusLevel,
        }

        const sql = 'UPDATE customers SET CusName=?, CusEmail=?, CusLevel=? WHERE CusID=? AND AID=?'

        const [results] = await conn.query(sql, [cusData.CusName, cusData.CusEmail, cusData.CusLevel, req.params.CusID, admin.AID])

        res.json({
            message: 'Customer updated successfully!',
            customer: results
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const admin = req.admin

        const sql = 'UPDATE customers SET CusIsDelete=1 sWHERE CusID=? AND AID=?'

        const [results] = await conn.query(sql, [req.params.CusID, admin.AID])

        res.json({
            message: 'Customer deleted successfully!',
            customer: results
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const getSearchCustomers = async (req,res) => {
    try {
        const admin = req.admin
        //รอรับ Start_CusUpdate และ End_CusUpdate จาก frontend
        const [checkResult] = await conn.query('SELECT * FROM customers WHERE AID = ? AND CusUpdate BETWEEN $Start_CusUpdate AND $End_CusUpdate ;', [admin.AID])

        res.json({
            message: 'Show search Customers successfully!!',
            customer: checkResult
        })
    } catch(error) {
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        })        
    }
}


module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getSearchCustomers

}