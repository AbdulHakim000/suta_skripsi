module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM user", callback);
    },
    findByEmail: async (db, email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            });
        });
    },
    insertData: async (db, data) => {
        const { id, ...dataWithoutId } = data;
        // Mengembalikan Promise
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO user SET ?", dataWithoutId, (err, result) => {
                if (err) {
                    // Menolak Promise jika ada kesalahan
                    return reject(err);
                }
                // Menyelesaikan Promise dengan hasil query
                resolve(result);
            });
        });
    },
    // updateData: (db, id, data, callback) => {
    //     db.query("UPDATE user SET ? WHERE id  = ?", [data, id], callback);
    // },
    updateData: (db, id, data) => {
        return new Promise((resolve, reject) => {
            db.query("UPDATE user SET ? WHERE id = ?", [data, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }  
            });
        });
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM user WHERE id = ?", id, callback);
    }
}