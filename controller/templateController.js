
require('dotenv').config()

const getTemplates = async (req, res) => {
    try {
        const admin = req.admin

        const [results] = await conn.query('SELECT TID, TName FROM templates WHERE AID = ? AND TIsDelete = 0', admin.AID)

        res.json({
            message: 'show templates successfully!!',
            templates: results
        })

    } catch (error) {
        res.status(403).json({
            message: 'Authentication failed',
            error
        })
    }
}

const getTemplateById = async (req, res) => {
    try {
        const admin = req.admin

        const sql = 'SELECT TID, TName, TContent FROM templates WHERE TID = ? AND AID = ? AND TIsDelete = 0'
        const [checkResult] = await conn.query(sql, [req.params.TID, admin.AID])

        res.json({
            message: 'Show selected template successfully!!',
            template: checkResult
        })

    } catch (error) {
        res.status(403).json({
            message: 'Authentication failed',
            error
        })
    }
}

const createTemplate = async (req, res) => {
    try {
        const admin = req.admin

        const { TName, TContent } = req.body
        const templateData = {
            TName,
            TContent,
            AID: admin.AID
        }
        
        const sql = 'INSERT INTO templates (`TName`, `TContent`, `AID`) VALUES (?, ?, ?)'

        const [results] = await conn.query(sql, [templateData.TName, templateData.TContent, admin.AID])

        res.json({
            message: 'Create template successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Authentication failed',
            error
        })
    }
}

const updateTemplate = async (req, res) => {
    try {
        const admin = req.admin

        const { TName, TContent } = req.body

        const templateData = {
            TName,
            TContent,
        }

        const sql = 'UPDATE templates SET TName=?, TContent=? WHERE TID=? AND AID=?'

        const [results] = await conn.query(sql, [templateData.TName, templateData.TContent, req.params.TID, admin.AID])

        res.json({
            message: 'Update template successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Update template failed :(',
            error
        })
    }
}

const deleteTemplate = async (req, res) => {
    try {
        const admin = req.admin

        const sql = 'UPDATE templates SET TIsDelete=1 WHERE TID=? AND AID=?'

        const [results] = await conn.query(sql, [req.params.TID, admin.AID])

        res.json({
            message: 'Delete template successfully!!',
            template: results
        })
    } catch (error) {
        res.status(403).json({
            message: 'Delete template failed :(',
            error
        })
    }
}

module.exports = {
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate
}
