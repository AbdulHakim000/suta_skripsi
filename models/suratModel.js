module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM surat", callback);
    },
    fetchDataTahanan: (db, callback) => {
        db.query("SELECT * FROM tahanan", callback);
    },
    fetchDataPembesuk: (db, callback) => {
        db.query("SELECT * FROM pembesuk", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM surat WHERE id_surat = ", id, callback);
    },
    insertData: (db, data, callback) => {
        const { id_surat, ...dataWithoutId } = data;
        db.query("INSERT INTO surat SET ?", dataWithoutId, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    updateData: (db, id, data, callback) => {
        db.query("UPDATE surat SET ? WHERE id_surat = ?", [data, id], callback);
    },
    deleteData: (db, id, callback) => {
        db.query("DELETE FROM surat WHERE id_surat = ?", id, callback);
    },
    fetchJoinedData: (db, callback) => {
        db.query("SELECT surat.*, tahanan.nama_tahanan, tahanan.tmp_lahir, tahanan.tgl_lahir, tahanan.jns_kelamin, tahanan.pekerjaan, pembesuk.nama_pembesuk, pembesuk.provinsi, pembesuk.kabupaten, pembesuk.kecamatan, pembesuk.kelurahan FROM surat INNER JOIN tahanan ON surat.registrasi_tahanan = tahanan.registrasi_tahanan INNER JOIN pembesuk ON surat.nik = pembesuk.nik", callback);
    }
}