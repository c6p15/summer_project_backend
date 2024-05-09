
require('dotenv').config();

const express = require('express')
const router = require('../router/routes')
const db = require('../config/db')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json())

app.use('/', router)

const PORT = process.env.PORT || 8888

app.listen(PORT, async (req, res) =>{
    await db()
    console.log(`Server is running on http://localhost:${PORT}`)
})

require('../cron/cronjobs')
