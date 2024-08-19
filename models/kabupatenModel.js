module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM kabupaten", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM kabupaten WHERE id = ", id, callback);
    },
    insertData: async (db, data) => {
        const { id, ...dataWithoutId } = data;
        // Mengembalikan Promise
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO kabupaten SET ?", dataWithoutId, (err, result) => {
                if (err) {
                    // Menolak Promise jika ada kesalahan
                    return reject(err);
                }
                // Menyelesaikan Promise dengan hasil query
                resolve(result);
            });
        });
    },
    updateData: (db, id, data) => {
            return new Promise((resolve, reject) => {
                db.query("UPDATE kabupaten SET ? WHERE id = ?", [data, id], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }  
                });
            });
        },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM kabupaten WHERE id = ?", id, callback);
    }
}