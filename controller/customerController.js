
require('dotenv').config()

const getCustomers = async (req, res) => {
    try {
        const admin = req.admin;
        const { offset, limit, page } = req.pagination;
        let { selectedLevel } = req.query;

        // Parse selectedLevel if it's a string (from query parameters)
        if (typeof selectedLevel === 'string') {
            selectedLevel = selectedLevel.split(','); // Assuming the values are comma-separated
        }

        // Initialize query strings
        let countQuery = 'SELECT COUNT(*) AS totalCount FROM customers WHERE AID = ? AND CusIsDelete = 0';
        let sql = 'SELECT CusID, CusName, CusEmail, CusLevel, CusUpdate FROM customers WHERE AID = ? AND CusIsDelete = 0';
        
        // Initialize parameters array
        let queryParams = [admin.AID];

        // Add selectedLevel condition if provided
        if (selectedLevel && selectedLevel.length > 0) {
            const levelPlaceholders = selectedLevel.map(() => '?').join(',');
            countQuery += ` AND CusLevel IN (${levelPlaceholders})`;
            sql += ` AND CusLevel IN (${levelPlaceholders})`;
            queryParams = queryParams.concat(selectedLevel);
        }

        // Add pagination parameters
        sql += ' LIMIT ?, ?';
        queryParams.push(offset, limit);

        // Execute count query
        const [countResult] = await conn.query(countQuery, queryParams.slice(0, queryParams.length - 2)); // Remove offset and limit for count query
        const totalCount = countResult && countResult.length > 0 ? countResult[0].totalCount : 0;

        // Execute main query
        const [customerResults] = await conn.query(sql, queryParams);

        res.json({
            message: 'Show customers successfully!',
            customers: customerResults,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit) // Calculate total pages based on totalCount
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

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

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,

}