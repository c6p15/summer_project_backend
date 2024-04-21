const express = require('express')
const { register, login, getAdmin, updateAdmin } = require('../controller/adminController')
const { getBroadcasts, getBroadcastById, createBroadcast, updateBroadcast, duplicateBroadcast, deleteBroadcast, getSearchBroadcasts, getBroadcaststest } = require('../controller/broadcastController')
const { getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate } = require('../controller/templateController')
const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getSearchCustomers } = require('../controller/customerController')
const Authentication = require('../middleware/authentication')
const { getActivityLogs } = require('../controller/activityLogController')
const router = express.Router()

// Admin's API
router.post('/register', register)
router.post('/login', login)
router.get('/admin', Authentication, getAdmin)
router.put('/admin/:AID', Authentication, updateAdmin)

// Broadcast's API
router.get('/broadcasts-test', getBroadcaststest)
router.get('/broadcasts', Authentication, getBroadcasts)
router.get('/broadcasts/:BID', Authentication, getBroadcastById)
router.post('/broadcasts', Authentication, createBroadcast)
router.put('/broadcasts/:BID', Authentication, updateBroadcast)
router.post('/broadcasts/duplicate/:BID', Authentication, duplicateBroadcast)
router.put('/broadcasts/delete/:BID', Authentication, deleteBroadcast)
router.get('/broadcasts/search', Authentication, getSearchBroadcasts)


// Template's API
router.get('/templates',Authentication, getTemplates)
router.get('/templates/:TID',Authentication, getTemplateById)
router.post('/templates',Authentication, createTemplate)
router.put('/templates/:TID',Authentication, updateTemplate)
router.put('/templates/delete/:TID',Authentication, deleteTemplate)

// Customer's API
router.get('/customers',Authentication, getCustomers)
router.get('/customers/:CusID',Authentication, getCustomerById)
router.post('/customers',Authentication, createCustomer)
router.put('/customers/:CusID',Authentication, updateCustomer)
router.put('/customers/delete/:CusID',Authentication, deleteCustomer)
router.get('/customers/search',Authentication, getSearchCustomers)

// Activity Log's API
router.get('/activity-log',Authentication,getActivityLogs)

module.exports = router
