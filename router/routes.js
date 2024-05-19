const express = require('express')
const { register, login, getAllAdmins, updateAdmin } = require('../controller/adminController')
const { getBroadcasts, getBroadcastById, createBroadcast, updateBroadcast, duplicateBroadcast, deleteBroadcast, getBroadcaststest, getBroadcastsbyDate, getBroadcastsbyName, getBroadcastsbyStatus, getBroadcastsbyTag } = require('../controller/broadcastController')
const { getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate, getTemplatesbyName } = require('../controller/templateController')
const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomersbyName } = require('../controller/customerController')
const Authentication = require('../middleware/authentication')
const { getActivityLogs } = require('../controller/activityLogController')
const paginateResults = require('../middleware/pagination')
const { emailSend } = require('../controller/emailController')


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
router.get('/broadcasts/search', Authentication, paginateResults, getBroadcastsbyDate)
router.get('/broadcasts/search', Authentication, paginateResults, getBroadcastsbyStatus)
router.get('/broadcasts/search', Authentication, paginateResults, getBroadcastsbyTag)
router.get('/broadcasts/search', Authentication, paginateResults, getBroadcastsbyName)
// add getBy ....


// Template's API
router.get('/templates',Authentication, paginateResults, getTemplates)
router.get('/templates/:TID',Authentication, getTemplateById)
router.post('/templates',Authentication, createTemplate)
router.put('/templates/:TID',Authentication, updateTemplate)
router.put('/templates/delete/:TID',Authentication, deleteTemplate)
router.get('/templates/search',Authentication, paginateResults, getTemplatesbyName)


// Customer's API
router.get('/customers',Authentication, paginateResults, getCustomers)
router.get('/customers/:CusID',Authentication, getCustomerById)
router.post('/customers',Authentication, createCustomer)
router.put('/customers/:CusID',Authentication, updateCustomer)
router.put('/customers/delete/:CusID',Authentication, deleteCustomer)
router.get('/customers/search',Authentication, paginateResults, getCustomersbyName)

// Activity Log's API
router.get('/activity-log',Authentication, paginateResults, getActivityLogs)

// Email Send API

router.post('/send-email',emailSend)

module.exports = router
