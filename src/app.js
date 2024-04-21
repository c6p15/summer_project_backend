
require('dotenv').config();

const express = require('express')
const router = require('../router/routes')
const db = require('../config/db')

const app = express()
app.use(express.json())

app.use('/', router)

<<<<<<< HEAD
// สร้างไว้ test api
const port ='8000'

// const PORT = process.env.PORT || 8888
const PORT = port || 8888
=======
const PORT = process.env.PORT || 8888
>>>>>>> f068b06047f061cce35c43a97b1cc2ef03a9c51a

app.listen(PORT, async (req, res) =>{
    await db()
    console.log(`Server is running on http://localhost:${PORT}`)
})
