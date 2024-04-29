
require('dotenv').config();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validateEmail, validateUsername, validatePassword} = require('../service/adminValidation')

/*
// สร้างไว้ test api
const secret = 'MySecret'
*/

const register = async (req, res) => {
    try {
        const { AEmail, AUsername, APassword } = req.body;
        
        if (!validateEmail(AEmail)) {
            return res.status(400).json({ message: 'Email must contain @ symbol' })
        }

        if (!validateUsername(AUsername)) {
            return res.status(400).json({ message: 'Username must be between 4 and 20 characters long' })
        }

        if (!validatePassword(APassword)) {
            return res.status(400).json({ message: 'Password must be between 8 and 20 characters long' })
        }

        // Hash password with salt
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
    } catch (error) {
        res.status(500).json({
            message: 'Registration failed :(',
            error
        })
    }
}

const login = async (req, res) => {
    try {
        const { AUsername, APassword } = req.body

        // Validate username
        if (!validateUsername(AUsername)) {
            return res.status(400).json({ message: 'Invalid username format' })
        }

        // Validate password
        if (!validatePassword(APassword)) {
            return res.status(400).json({ message: 'Invalid password format' })
        }

        const [results] = await conn.query('SELECT * FROM admins WHERE AUsername = ?', AUsername)
        const adminData = results[0];

        if (!adminData) {
            return res.status(400).json({ message: 'Login failed (incorrect username or password)' })
        }

        // Check password match
        const match = await bcrypt.compare(APassword, adminData.APassword);
        if (!match) {
            return res.status(400).json({ message: 'Login failed (incorrect username or password)' })
        }

        // Create token
        const token = jwt.sign({ AID: adminData.AID }, process.env.SECRET, { expiresIn: '1h' })
        res.json({ message: 'Login successfully!!', token })

    } catch (error) {
        console.error('Login error: ', error)
        res.status(500).json({ message: 'Login failed :(', error: error.message })
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