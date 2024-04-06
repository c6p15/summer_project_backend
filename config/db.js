const mysql = require('mysql2/promise')

const db = async () =>{
    conn = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "summer_project"
    })
}

module.exports = db