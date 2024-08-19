const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'suta_db' // Sesuaikan dengan nama database Anda
}).promise(); // Gunakan .promise() untuk dukungan async/await

module.exports = pool;