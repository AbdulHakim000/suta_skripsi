const kabupaten = require('../models/kabupatenModel');

module.exports = {
    index: (req, res) => {
        kabupaten.fetchData(req.db, (err, rows) => {
            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            if (err) {
                req.flash('error', err.message);
                res.render('kabupaten/index', { data:'' });
            } else {
                res.render('kabupaten/index', {
                    layout: layout,
                    title: 'Halaman kabupaten',
                    kabupatens: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
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

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('kabupaten/detail_modal', { 
                layout: layout,
                title: 'Halaman kabupaten',
                kabupaten, 
                user: req.session.user,
                userRole: req.session.user.role,
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

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('kabupaten/edit_modal', { 
                layout: layout,
                title: 'Halaman kabupaten',
                kabupaten, 
                kabupatens: rows})
        }
    });

    
}  ,

add: async (req, res) => {
    const { id_kabupaten, nama_kabupaten, id_provinsi } = req.body;
    const form_kabupaten = { id_kabupaten, nama_kabupaten, id_provinsi };

    try {
        console.log(form_kabupaten);

        // Assuming kabupaten.insertData returns a Promise
        await kabupaten.insertData(req.db, form_kabupaten);

        req.flash('success', 'Data berhasil dimasukkan ke database');
        return res.redirect('/kabupaten');
    } catch (err) {
        req.flash('error', `Error Ketika Memasukkan Data: ${err.message}`);
        return res.redirect('/kabupaten');
    }
},
    
    
    
update: async (req, res) => {
    const { id, id_kabupaten, nama_kabupaten, id_provinsi } = req.body;
    const form_kabupaten = {
        id,
        id_kabupaten,
        nama_kabupaten,
        id_provinsi,
    };

    console.log(form_kabupaten);

    try {
        // Assuming kabupaten.updateData returns a Promise
        await kabupaten.updateData(req.db, id, form_kabupaten);

        req.flash('success', 'Data Berhasil di Update');
        res.redirect('/kabupaten');
    } catch (err) {
        req.flash('error', `Error Ketika Memasukkan Data: ${err.message}`);
        res.redirect('/kabupaten');
    }
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