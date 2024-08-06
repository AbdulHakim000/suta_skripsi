module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM provinsi", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM provinsi WHERE id = ", id, callback);
    },
    insertData: (db, data, callback) => {
        const { id, ...dataWithoutId } = data;
        db.query("INSERT INTO provinsi SET ?", dataWithoutId, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    updateData: (db, id, data, callback) => {
        db.query("UPDATE provinsi SET ? WHERE id = ?", [data, id], callback);
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM provinsi WHERE id = ?", id, callback);
    }
}