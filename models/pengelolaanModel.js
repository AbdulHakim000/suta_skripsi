module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM pengelolaan", callback);
    },
    fetchDataTahanan: (db, callback) => {
        db.query("SELECT * FROM tahanan", callback);
    },
    fetchDataJaksa: (db, callback) => {
        db.query("SELECT * FROM jaksa", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM pengelolaan WHERE id = ", id, callback);
    },
    insertData: async (db, data) => {
        const { id, ...dataWithoutId } = data;
        // Mengembalikan Promise
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO pengelolaan SET ?", dataWithoutId, (err, result) => {
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
            db.query("UPDATE pengelolaan SET ? WHERE id = ?", [data, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }  
            });
        });
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM pengelolaan WHERE id = ?", id, callback);
    },
        fetchJoinedData: (db, callback) => {
        db.query("SELECT pengelolaan.*, tahanan.nama_tahanan, tahanan.perkara, tahanan.tgl_lahir, tahanan.pekerjaan FROM pengelolaan INNER JOIN tahanan ON pengelolaan.registrasi_tahanan = tahanan.registrasi_tahanan", callback);
    }
}