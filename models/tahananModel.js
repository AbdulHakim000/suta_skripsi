module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM tahanan", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM tahanan WHERE id = ", id, callback);
    },
    insertData: (db, data, callback) => {
        const { id_tahanan, ...dataWithoutId } = data;
        db.query("INSERT INTO tahanan SET ?", dataWithoutId, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    updateData: (db, id, data, callback) => {
        db.query("UPDATE tahanan SET ? WHERE id  = ?", [data, id], callback);
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM tahanan WHERE id = ?", id, callback);
    }
}