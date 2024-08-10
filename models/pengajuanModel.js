module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM pengajuan", callback);
    },
    fetchDataTahanan: (db, callback) => {
        db.query("SELECT * FROM tahanan", callback);
    },
    fetchDataPembesuk: (db, callback) => {
        db.query("SELECT * FROM pembesuk", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM pengajuan WHERE id_pengajuan = ", id, callback);
    },
    insertData: async (db, data) => {
        const { id_pengajuan, ...dataWithoutId } = data;
        // Mengembalikan Promise
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO pengajuan SET ?", dataWithoutId, (err, result) => {
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
            db.query("UPDATE pengajuan SET ? WHERE id_pengajuan = ?", [data, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }  
            });
        });
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM pengajuan WHERE id_pengajuan = ?", id, callback);
    },
        fetchJoinedData: (db, callback) => {
        db.query("SELECT surat.*, tahanan.nama_tahanan, tahanan.tmp_lahir, tahanan.tgl_lahir, tahanan.jns_kelamin, tahanan.pekerjaan, pembesuk.nama_pembesuk, pembesuk.provinsi, pembesuk.kabupaten, pembesuk.kecamatan, pembesuk.kelurahan FROM surat INNER JOIN tahanan ON surat.registrasi_tahanan = tahanan.registrasi_tahanan INNER JOIN pembesuk ON surat.nik = pembesuk.nik", callback);
    }
}