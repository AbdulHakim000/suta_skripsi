module.exports = {
   fetchData: (db, callback) => {
        db.query("SELECT * FROM jaksa", callback);
    },
    getById: (db, id, callback) => {
        db.query("SELECT * FROM jaksa WHERE id = ?", [id], callback); // Tambahkan placeholder ?
    },
    async insertData(db, data) {
        const result = await db.query("INSERT INTO jaksa SET ?", [data]);
        return result;
    },

    updateData: (db, nip, data) => {
        return new Promise((resolve, reject) => {
            db.query("UPDATE jaksa SET ? WHERE nip = ?", [data, nip], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }  
            });
        });
    },
    deleteData: (db, nip, callback) => {
        db.query("DELETE FROM jaksa WHERE nip = ?", nip, callback);
    }
};