const express = require('express')
const { register, login, getAllAdmins, updateAdmin } = require('../controller/adminController')
const { getBroadcasts, getBroadcastById, createBroadcast, updateBroadcast, duplicateBroadcast, deleteBroadcast, getBroadcaststest, getBTagsforFilter } = require('../controller/broadcastController')
const { getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate } = require('../controller/templateController')
const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require('../controller/customerController')
const Authentication = require('../middleware/authentication')
const { getActivityLogs } = require('../controller/activityLogController')
const paginateResults = require('../middleware/pagination')

const router = express.Router()

// Admin's API
router.post('/register', register)
router.post('/login', login)
router.get('/admins', Authentication, paginateResults , getAllAdmins)
router.put('/admin/:AID', Authentication, updateAdmin)

// Broadcast's API
router.get('/broadcasts-test',paginateResults, getBroadcaststest)
router.get('/broadcasts', Authentication, paginateResults, getBroadcasts)
router.get('/broadcasts/:BID', Authentication, getBroadcastById)
router.post('/broadcasts', Authentication, createBroadcast)
router.put('/broadcasts/:BID', Authentication, updateBroadcast)
router.post('/broadcasts/duplicate/:BID', Authentication, duplicateBroadcast)
router.put('/broadcasts/delete/:BID', Authentication, deleteBroadcast)
router.get('/filtertags', Authentication, getBTagsforFilter)

// Template's API
router.get('/templates',Authentication, paginateResults, getTemplates)
router.get('/templates/:TID',Authentication, getTemplateById)
router.post('/templates',Authentication, createTemplate)
router.put('/templates/:TID',Authentication, updateTemplate)
router.put('/templates/delete/:TID',Authentication, deleteTemplate)

// Customer's API
router.get('/customers',Authentication, paginateResults, getCustomers)
router.get('/customers/:CusID',Authentication, getCustomerById)
router.post('/customers',Authentication, createCustomer)
router.put('/customers/:CusID',Authentication, updateCustomer)
router.put('/customers/delete/:CusID',Authentication, deleteCustomer)

// Activity Log's API
router.get('/activity-log',Authentication, paginateResults, getActivityLogs)



module.exports = router
