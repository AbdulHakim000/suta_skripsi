const provinsi = require('../models/provinsiModel');

module.exports = {

    index: (req, res) => {
        const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
        provinsi.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message);
                res.render('provinsi/index', { data:'' });
            } else {
                res.render('provinsi/index', {
                    layout: layout,
                    title: 'Halaman provinsi',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    provinsis: rows
                });
            }
        });
    },

    detail: (req, res) => {
    const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
     provinsi.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('provinsi/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const provinsi = rows.find(provinsi => provinsi.id_provinsi === id);
            res.render('provinsi/detail_modal', { 
                layout: layout,
                title: 'Halaman provinsi',
                user: req.session.user,
                userRole: req.session.user.role,
                provinsi, 
                provinsis: rows})
        }
    });
    },

    edit: (req, res) => {
     provinsi.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('provinsi/edit_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const provinsi = rows.find(provinsi => provinsi.id === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('provinsi/edit_modal', { 
                layout: layout,
                title: 'Halaman provinsi',
                provinsi, 
                provinsis: rows})
        }
    });

    
}  ,



add: (req, res) => {
    const {id_provinsi, nama_provinsi} = req.body;
    const form_provinsi = {id_provinsi, nama_provinsi};
    
    console.log(form_provinsi);

    provinsi.insertData(req.db, form_provinsi, (err, result) => {
        if (err) {
            req.flash('error', `Error Ketika Memasukkan Data: ${err.message}`);
            return res.redirect('/provinsi');
        } else {
            req.flash('success', 'Data berhasil dimasukkan ke database');
            return res.redirect('/provinsi');
        }
    });
    },
    
    
    
update: (req, res) => {
    const {id, id_provinsi, nama_provinsi} = req.body;
    const form_provinsi = {
            id,
            id_provinsi,
            nama_provinsi,
        }
    
    console.log(form_provinsi);
    provinsi.updateData(req.db, id, form_provinsi, (err, result) => {
            if (err) {
                req.flash('error','Error Ketika Memasukkan Data', err.message);
                res.redirect('/provinsi');
            } else {
                req.flash('succes','Data Berhasil diUpdate');
                res.redirect('/provinsi');
            }
        })
    },


    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        provinsi.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/provinsi');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/provinsi');
        }
    })
    },
}