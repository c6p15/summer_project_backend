require('dotenv').config()

const jwt = require('jsonwebtoken')

//
const getTemplates = async (req,res) => {
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

        const [results] = await conn.query('SELECT TID, TName FROM templates WHERE AID =? AND TIsDelete = 0', admin.AID)

        res.json({
            message: 'Show Templates Successfully!!',
            templates: results
        })

    }catch(error){
        res.status(403).json({
            message: 'authentication fail',
            error
        })
    }
}

const getTemplateById= async (req,res) =>{
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

        const sql = ('SELECT TID, TName, TContent FROM templates WHERE TID =? AND AID =? AND TIsDelete = 0')
        const [checkResult] = await conn.query(sql , [req.params.TID,admin.AID])

        res.json({
            message: 'Show Selected Template Successfully!!',
            template: checkResult
        })

    }catch(error){
        res.status(403).json({
            message: 'authentication fail',
            error
        })
    }
}

const createTemplate = async (req,res) =>{
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

        const { TName , TContent } = req.body
        const templateData ={
            TName,
            TContent,
            AID: admin.AID
        }
        
        const sql = ('INSERT INTO templates (`TName`, `TContent`, `AID`) VALUES (?, ?, ?)')

        const [results] = await conn.query(sql,[templateData.TName, templateData.TContent, admin.AID])

        res.json({
            message: 'Create Template Successfully!!',
            template: results
        })
    }catch(error){
        res.status(403).json({
            message: 'authentication fail',
            error
        })
    }
}

const updateTemplate = async (req, res) => {
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

        const { TName, TContent } = req.body

        const templateData = {
            TName,
            TContent,
        }

        const sql = 'UPDATE templates SET TName=?, TContent=? WHERE TID=? AND AID=? '

        const [results] = await conn.query(sql, [templateData.TName, templateData.TContent, req.params.TID, admin.AID])

        res.json({
            message: 'Update Template Successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Update fail :(',
            error
        })
    }
}

const deleteTemplate = async (req, res) => {
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

        const sql = 'UPDATE templates SET TIsDelete=1 WHERE TID=? AND AID=?'

        const [results] = await conn.query(sql, [req.params.TID, admin.AID])

        res.json({
            message: 'Delete Template Successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Delete Template fail :(',
            error
        })
    }
}

module.exports = {
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,

}