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
    insertData: (db, data, callback) => {
        const { id, ...dataWithoutId } = data;
        db.query("INSERT INTO pengelolaan SET ?", dataWithoutId, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    updateData: (db, id, data, callback) => {
        db.query("UPDATE pengelolaan SET ? WHERE id  = ?", [data, id], callback);
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM pengelolaan WHERE id = ?", id, callback);
    },
        fetchJoinedData: (db, callback) => {
        db.query("SELECT pengelolaan.*, tahanan.nama_tahanan, tahanan.perkara, tahanan.tgl_lahir, tahanan.pekerjaan FROM pengelolaan INNER JOIN tahanan ON pengelolaan.registrasi_tahanan = tahanan.registrasi_tahanan", callback);
    }
}