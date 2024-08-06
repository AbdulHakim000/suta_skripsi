module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM kabupaten", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM kabupaten WHERE id = ", id, callback);
    },
    insertData: (db, data, callback) => {
        const { id, ...dataWithoutId } = data;
        db.query("INSERT INTO kabupaten SET ?", dataWithoutId, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    updateData: (db, id, data, callback) => {
        db.query("UPDATE kabupaten SET ? WHERE id = ?", [data, id], callback);
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM kabupaten WHERE id = ?", id, callback);
    }
}