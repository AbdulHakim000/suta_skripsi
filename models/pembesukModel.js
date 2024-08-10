module.exports = {
    fetchData: (db, callback) => {
        db.query("SELECT * FROM pembesuk", callback);
    },
    getById: (db, nik, callback) => {
        db.query("SELECT * FROM pembesuk WHERE nik = ", nik, callback);
    },
    async insertData(db, data) {
        const result = await db.query("INSERT INTO pembesuk SET ?", [data]);
        return result;
    },

    updateData: (db, nik, data) => {
        return new Promise((resolve, reject) => {
            db.query("UPDATE pembesuk SET ? WHERE nik = ?", [data, nik], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }  
            });
        });
    },
    deleteData: (db, nik, callback) => {
        db.query("DELETE FROM pembesuk WHERE nik = ?", nik, callback);
    }
}