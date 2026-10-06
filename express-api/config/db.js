const mysql = require("mysql2/promise")
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "17042006",
    database: "newsdb"
})
module.exports = db;