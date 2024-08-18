module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM tahanan", callback);
    },
    fetchDataNarkotika: (db, callback) => {
        db.query("SELECT * FROM tahanan WHERE perkara = 'Narkotika / Enz.2'", (err, results) => {
            if (err) {
                return callback(err, null); // Kirimkan error ke callback jika ada
            }
            callback(null, results); // Kirimkan hasil query ke callback jika tidak ada error
        });
    },
    fetchDataOharda: (db, callback) => {
        db.query("SELECT * FROM tahanan WHERE perkara = 'Orang dan Harta Benda / Eoh.2'", (err, results) => {
            if (err) {
                return callback(err, null); // Kirimkan error ke callback jika ada
            }
            callback(null, results); // Kirimkan hasil query ke callback jika tidak ada error
        });
    },
    fetchDataKamtibum: (db, callback) => {
        db.query("SELECT * FROM tahanan WHERE perkara = 'Keamanan dan Ketertiban Umum / Eku.2'", (err, results) => {
            if (err) {
                return callback(err, null); // Kirimkan error ke callback jika ada
            }
            callback(null, results); // Kirimkan hasil query ke callback jika tidak ada error
        });
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM tahanan WHERE id = ", id, callback);
    },
    insertData: async (db, data) => {
        const { id_tahanan, ...dataWithoutId } = data;
        // Mengembalikan Promise
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO tahanan SET ?", dataWithoutId, (err, result) => {
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
    //     db.query("UPDATE tahanan SET ? WHERE id  = ?", [data, id], callback);
    // },
    updateData: (db, id, data) => {
        return new Promise((resolve, reject) => {
            db.query("UPDATE tahanan SET ? WHERE id = ?", [data, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }  
            });
        });
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM tahanan WHERE id = ?", id, callback);
    }
}