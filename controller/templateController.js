
require('dotenv').config()

// const validateTName = require('../../frontend/summer_project/src/validator/templateValidator');

const getTemplates = async (req, res) => {
    try {
        const admin = req.admin
        const { offset, limit, page } = req.pagination;

        const [templateResults] = await conn.query('SELECT TID, TName FROM templates WHERE AID = ? AND TIsDelete = 0 LIMIT ?,?', [admin.AID, offset,limit])

        res.json({
            message: 'show templates successfully!!',
            templates: templateResults,
            currentPage: page,
            totalPages: Math.ceil(templateResults.length / limit)
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

        if (validateTName(TName) !== true) {
            return res.status(400).json({ message: validateTName(TName) })
        }

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

const getTemplatesbyName = async (req,res) => {
    try {
        const admin = req.admin
        const { offset, limit, page } = req.pagination;

        //const SearchTName รับค่าจาก Fronend

        const [checkResult] = await conn.query('SELECT * FROM templates WHERE AID = ? AND TName LIKE '%SearchTName%' LIMIT ?, ?', [admin.AID, offset, limit])

        res.json({
            message: 'Show search Template successfully!!',
            broadcast: checkResult,
            currentPage: page,
            totalPages: Math.ceil(templateResults.length / limit)
            
        })
    } catch(error) {
        res.status(403).json({
            message: 'Search Templates failed',
            error: error.message
        })        
    }
}

module.exports = {
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesbyName

}