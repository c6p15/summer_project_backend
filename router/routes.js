const express = require('express')
const { register, login, getAdmin } = require('../controller/adminController')
const { getBroadcasts, getBroadcastById } = require('../controller/broadcastController')
const { getTemplates, getTemplateById } = require('../controller/templateController')
const { getCustomers, getCustomerById } = require('../controller/customerController')
const router = express.Router()

// Admin's API
router.post('/register', register)
router.post('/login', login)
router.get('/admin', getAdmin)

// Broadcast's API
router.get('/broadcasts',getBroadcasts)
router.get('/broadcast/:BID',getBroadcastById)


// Template's API
router.get('/templates',getTemplates)
router.get('/template/:TID',getTemplateById)

// Customer's API
router.get('/customers',getCustomers)
router.get('/customer/:CID',getCustomerById)




module.exports = router