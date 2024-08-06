module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM pembesuk", callback);
    },
    getById: (db, nik, callback) => {
        db.query("SELECT * FROM pembesuk WHERE nik = ", nik, callback);
    },
    insertData: (db, data, callback) => {
        db.query("INSERT INTO pembesuk SET ?", data, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    updateData: (db, nik, data, callback) => {
        db.query("UPDATE pembesuk SET ? WHERE nik = ?", [data, nik], callback);
    },
    deleteData: (db, nik, callback) => {
        db.query("DELETE FROM pembesuk WHERE nik = ?", nik, callback);
    }
}