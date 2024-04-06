const express = require('express')
const { register, login, getAdmin } = require('../controller/adminController')
const { getBroadcasts, getBroadcastById, createBroadcast } = require('../controller/broadcastController')
const { getTemplates, getTemplateById, createTemplate } = require('../controller/templateController')
const { getCustomers, getCustomerById, createCustomer } = require('../controller/customerController')
const router = express.Router()

// Admin's API
router.post('/register', register)
router.post('/login', login)
router.get('/admin', getAdmin)

// Broadcast's API
router.get('/broadcasts',getBroadcasts)
router.get('/broadcast/:BID',getBroadcastById)
router.post('/broadcast',createBroadcast)


// Template's API
router.get('/templates',getTemplates)
router.get('/template/:TID',getTemplateById)
router.post('/template',createTemplate)

// Customer's API
router.get('/customers',getCustomers)
router.get('/customer/:CID',getCustomerById)
router.post('/customer',createCustomer)



module.exports = router