
require('dotenv').config();

const express = require('express')
const router = require('../router/routes')
const db = require('../config/db')

const app = express()
app.use(express.json())

app.use('/', router)

// สร้างไว้ test api
const port ='8000'

// const PORT = process.env.PORT || 8888
const PORT = port || 8888

app.listen(PORT, async (req, res) =>{
    await db()
    console.log(`Server is running on http://localhost:${PORT}`)
})