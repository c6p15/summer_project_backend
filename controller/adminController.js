
require('dotenv').config();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

/*
// สร้างไว้ test api
const secret = 'MySecret'
*/

const register  = async (req, res) => {
    try{
        const { AEmail, AUsername, APassword } = req.body
        // hash password with salt
        const passwordHash = await bcrypt.hash(APassword, 10)
        const adminData = {
            AEmail,
            AUsername,
            APassword: passwordHash
    }
    const [results] = await conn.query('INSERT INTO admins SET ?', adminData)
    res.json({
        message: 'Registration Successfully!!',
        results
    })
    }catch(error){
        res.json({
            message:'Registration failed :(',
            error
        })
    }
}

const login = async (req, res) => {
    try{
        const { AUsername , APassword } = req.body
        const [results] = await conn.query('SELECT * FROM admins WHERE AUsername = ?', AUsername)
        const adminData = results[0]
        console.log(adminData)

        // check password match
        const match = await bcrypt.compare(APassword, adminData.APassword)
        if (!match){
            res.status(400).json({
                message:'Login failed (incorrect username or password)'
            })
            return false
        }

        // create token
        const token = jwt.sign({ AID: adminData.AID }, process.env.SECRET, {expiresIn: '1h'})
        res.json({
            message:'Login succesfully!!',
            token
        })

    }catch(error){
        console.error('Login error: ', error)
        res.status(500).json({
            message:'Login failed :(',
            error: error.message
        })        
    }
}

const getAllAdmins = async (req, res) => {
    try{
        const { offset, limit, page } = req.pagination;

        const [adminResult] = await conn.query('SELECT AID, AEmail, AUsername FROM admins LIMIT ?, ?',[offset, limit])
    
        res.json({
            message: 'Show Admin Successfully!!',
            admin: adminResult,
            currentPage: page,
            totalPages: Math.ceil(adminResult.length / limit)
        })

    }catch(error){
        res.status(403).json({
            message: 'Authentication failed',
            error: error.message
        })        
    }
}

const updateAdmin = async (req, res) => {
    try {
        const admin = req.admin

        const { AEmail, APassword } = req.body

        const [checkResult] = await conn.query('SELECT * FROM admins WHERE AID = ?', admin.AID)
        if (checkResult.length === 0) {
            return res.status(404).json({
                message: 'Admin not found'
            })
        }

        let hashedPassword = checkResult[0].APassword
        if (APassword) {
            hashedPassword = await bcrypt.hash(APassword, 10)
        }
        
        const sql = 'UPDATE admins SET AEmail=?, APassword=? WHERE AID=?'
        const [results] = await conn.query(sql, [AEmail, hashedPassword, admin.AID])

        res.json({
            message: 'Update Admin Successfully!!',
            admin: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Authentication failed',
            error
        })
    }
}

module.exports = {
    register,
    login,
    getAllAdmins,
    updateAdmin,

}