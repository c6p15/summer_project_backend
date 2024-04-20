const mysql = require('mysql2/promise')

const db = async () =>{
    conn = await mysql.createConnection({
        host: "summer-mysql-do-user-9899308-0.c.db.ondigitalocean.com",
        user: "doadmin",
        password: "AVNS_JDoFs_T4tfKzce45_ui",
        database: "defaultdb"
    })
}
module.exports = db