require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
        message: 'Register Successfully!!',
        results
    })
    }catch(error){
        res.json({
            message:'Register fail :(',
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
                message:'Login fail (wrong username, password)'
            })
            return false
        }

        // create token
        const token = jwt.sign({ AID: adminData.AID }, process.env.secret, {expiresIn: '1h'})
        res.json({
            message:'Login succesfully!!',
            token
        })

    }catch(error){
        res.status(401).json({
            message:'Login fail :(',
            error
        })        
    }
}

const getAdmin = async (req, res) => {
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

        const [checkResult] = await conn.query('SELECT * FROM admins WHERE AID = ?', admin.AID)

        const adminAttributes ={
            AID: checkResult[0].AID,
            AEmail: checkResult[0].AEmail,
            AUsername: checkResult[0].AUsername,

        }
    
        res.json({
            message: 'Show Admin Successfully!!',
            admin: adminAttributes
        })

    }catch(error){
        res.status(403).json({
            message: 'authentication fail',
            error
        })        
    }
}

const updateAdmin = async (req, res) => {
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
    register,
    login,
    getAdmin,
    updateAdmin,

}