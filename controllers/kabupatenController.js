const kabupaten = require('../models/kabupatenModel');

module.exports = {
    index: (req, res) => {
        kabupaten.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message);
                res.render('kabupaten/index', { data:'' });
            } else {
                res.render('kabupaten/index', {
                    layout: 'layout/main',
                    title: 'Halaman kabupaten',
                    kabupatens: rows
                });
            }
        });
    },

    detail: (req, res) => {
     kabupaten.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('kabupaten/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const kabupaten = rows.find(kabupaten => kabupaten.id_kabupaten === id);
            res.render('kabupaten/detail_modal', { 
                layout: 'layout/main',
                title: 'Halaman kabupaten',
                kabupaten, 
                kabupatens: rows})
        }
    });
    },

    edit: (req, res) => {
     kabupaten.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('kabupaten/edit_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const kabupaten = rows.find(kabupaten => kabupaten.id === id);
            res.render('kabupaten/edit_modal', { 
                layout: 'layout/main',
                title: 'Halaman kabupaten',
                kabupaten, 
                kabupatens: rows})
        }
    });

    
}  ,

add: (req, res) => {
    const {id_kabupaten, nama_kabupaten, id_provinsi} = req.body;
    const form_kabupaten = {id_kabupaten, nama_kabupaten, id_provinsi};
    
    console.log(form_kabupaten);

    kabupaten.insertData(req.db, form_kabupaten, (err, result) => {
        if (err) {
            req.flash('error', `Error Ketika Memasukkan Data: ${err.message}`);
            return res.redirect('/kabupaten');
        } else {
            req.flash('success', 'Data berhasil dimasukkan ke database');
            return res.redirect('/kabupaten');
        }
    });
    },
    
    
    
update: (req, res) => {
    const {id, id_kabupaten, nama_kabupaten, id_provinsi} = req.body;
    const form_kabupaten = {
            id,
            id_kabupaten,
            nama_kabupaten,
            id_provinsi,
        }
    
    console.log(form_kabupaten);
    kabupaten.updateData(req.db, id, form_kabupaten, (err, result) => {
            if (err) {
                req.flash('error','Error Ketika Memasukkan Data', err.message);
                res.redirect('/kabupaten');
            } else {
                req.flash('succes','Data Berhasil diUpdate');
                res.redirect('/kabupaten');
            }
        })
    },


    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        kabupaten.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/kabupaten');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/kabupaten');
        }
    })
    },
}