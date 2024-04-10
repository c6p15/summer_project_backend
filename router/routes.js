const express = require('express')
const { register, login, getAdmin, updateAdmin } = require('../controller/adminController')
const { getBroadcasts, getBroadcastById, createBroadcast, updateBroadcast, duplicateBroadcast, deleteBroadcast } = require('../controller/broadcastController')
const { getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate } = require('../controller/templateController')
const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require('../controller/customerController')
const router = express.Router()

// Admin's API
router.post('/register',register)
router.post('/login',login)
router.get('/admin',getAdmin)
router.put('/admin/:AID',updateAdmin)

// Broadcast's API
router.get('/broadcasts',getBroadcasts)
router.get('/broadcasts/:BID',getBroadcastById)
router.post('/broadcasts',createBroadcast)
router.put('/broadcasts/:BID',updateBroadcast)
router.post('/broadcasts/duplicate/:BID',duplicateBroadcast)
router.put('/broadcasts/delete/:BID',deleteBroadcast)

// Template's API
router.get('/templates',getTemplates)
router.get('/templates/:TID',getTemplateById)
router.post('/templates',createTemplate)
router.put('/templates/:TID',updateTemplate)
router.put('/templates/delete/:TID',deleteTemplate)

// Customer's API
router.get('/customers',getCustomers)
router.get('/customers/:CusID',getCustomerById)
router.post('/customers',createCustomer)
router.put('/customers/:CusID',updateCustomer)
router.put('/customers/delete/:CusID',deleteCustomer)


module.exports = router