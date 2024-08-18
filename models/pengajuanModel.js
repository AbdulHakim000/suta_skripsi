module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM pengajuan_surat", callback);
    },
    fetchDataBelum: (db, callback) => {
        const query = `
            SELECT pengajuan_surat.*, tahanan.nama_tahanan 
            FROM pengajuan_surat 
            JOIN tahanan ON pengajuan_surat.registrasi_tahanan = tahanan.registrasi_tahanan
            WHERE pengajuan_surat.status_pengajuan = 'Belum Diproses'
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    fetchDataTerima: (db, callback) => {
        const query = `
            SELECT pengajuan_surat.*, tahanan.nama_tahanan 
            FROM pengajuan_surat 
            JOIN tahanan ON pengajuan_surat.registrasi_tahanan = tahanan.registrasi_tahanan
            WHERE pengajuan_surat.status_pengajuan = 'Diterima'
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    fetchDataTolak: (db, callback) => {
        const query = `
            SELECT pengajuan_surat.*, tahanan.nama_tahanan 
            FROM pengajuan_surat 
            JOIN tahanan ON pengajuan_surat.registrasi_tahanan = tahanan.registrasi_tahanan
            WHERE pengajuan_surat.status_pengajuan = 'Ditolak'
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    fetchDataTahanan: (db, callback) => {
        db.query("SELECT * FROM tahanan", callback);
    },
    fetchDataPembesuk: (db, callback) => {
        db.query("SELECT * FROM pembesuk", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM pengajuan_surat WHERE id = ", id, callback);
    },
    insertData: async (db, data) => {
        const { id_pengajuan_surat, ...dataWithoutId } = data;
        // Mengembalikan Promise
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO pengajuan_surat SET ?", dataWithoutId, (err, result) => {
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
            db.query("UPDATE pengajuan_surat SET ? WHERE id = ?", [data, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }  
            });
        });
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM pengajuan_surat WHERE id = ?", id, callback);
    },
        fetchJoinedData: (db, callback) => {
        db.query("SELECT surat.*, tahanan.nama_tahanan, tahanan.tmp_lahir, tahanan.tgl_lahir, tahanan.jns_kelamin, tahanan.pekerjaan, pembesuk.nama_pembesuk, pembesuk.provinsi, pembesuk.kabupaten, pembesuk.kecamatan, pembesuk.kelurahan FROM surat INNER JOIN tahanan ON surat.registrasi_tahanan = tahanan.registrasi_tahanan INNER JOIN pembesuk ON surat.nik = pembesuk.nik", callback);
    },
    fetchDataWithTahanan: (db, callback) => {
    const query = `
        SELECT pengajuan_surat.*, tahanan.nama_tahanan 
        FROM pengajuan_surat 
        JOIN tahanan ON pengajuan_surat.registrasi_tahanan = tahanan.registrasi_tahanan
    `;
    db.query(query, callback);
    },
    fetchDataByEmail: (db, email, callback) => {
        const query = 'SELECT * FROM pengajuan_surat WHERE pengajuan_by = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    fetchDataByEmail: (db, email, callback) => {
    const query = `
        SELECT 
            pengajuan_surat.*,
            tahanan.nama_tahanan,
            tahanan.tmp_lahir
        FROM 
            pengajuan_surat
        JOIN 
            tahanan ON pengajuan_surat.registrasi_tahanan = tahanan.registrasi_tahanan
        WHERE 
            pengajuan_surat.pengajuan_by = ?`;
    
    db.query(query, [email], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
},

updateStatus: (db, pengajuanId, status, callback) => {
        const query = 'UPDATE pengajuan_surat SET status_pengajuan = ? WHERE id = ?';
        db.query(query, [status, pengajuanId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
}