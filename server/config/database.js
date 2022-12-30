const mysql = require('mysql2/promise');

const pool = mysql.createPool({         // AWS DB 연결하기 (test: localDB 연결)
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "comp"
});

module.exports = {
    pool: pool
};
