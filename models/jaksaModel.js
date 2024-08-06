module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM jaksa", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM jaksa WHERE id = ", id, callback);
    },
    insertData: (db, data, callback) => {
        db.query("INSERT INTO jaksa SET ?", data, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    updateData: (db, nip, data, callback) => {
        db.query("UPDATE jaksa SET ? WHERE nip = ?", [data, nip], callback);
    },
    deleteData: (db, nip, callback) => {
        db.query("DELETE FROM jaksa WHERE nip = ?", nip, callback);
    }
}