
const mysql = require('mysql2/promise')

const db = async () => {
    try {
        conn = await mysql.createConnection({
            host: "summer-mysql-do-user-9899308-0.c.db.ondigitalocean.com",
            port: "25060",
            user: "doadmin",
            password: "AVNS_JDoFs_T4tfKzce45_ui",
            database: "defaultdb"
        });
        console.log("Database connected successfully!")
        return conn
    } catch (error) {
        console.error("Error connecting to database:", error)
        throw error 
    }
}

module.exports = db
