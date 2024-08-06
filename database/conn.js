const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'suta_db'
});

connection.connect((err) => {
    if (!!err) {
        console.log(err);
    } else {
        console.log('Berhasil Terkoneksi');
    }

})

module.exports = connection;