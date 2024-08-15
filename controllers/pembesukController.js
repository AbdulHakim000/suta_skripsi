const pembesuk = require('../models/pembesukModel');

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
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pembesuk/index', { data:''})
        } else {
            res.render('admin/pembesuk/index', { 
                layout: layout,
                userRole: req.session.user.role,
                user: req.session.user,
                title: 'Halaman Pembesuk',
                pembesuks: rows})
        }
    });
    },
    tambah: (req, res) => {

    const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pembesuk/add_modal', { data:''})
        } else {
            res.render('admin/pembesuk/add_modal', { 
                layout: layout,
                userRole: req.session.user.role,
                user: req.session.user,
                title: 'Halaman Pembesuk',
                pembesuks: rows})
        }
    });
    },

    detail: (req, res) => {
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pembesuk/detail_modal', { data:''})
        } else {
            const nik = parseInt(req.params.nik);
            const pembesuk = rows.find(pembesuk => pembesuk.nik === nik);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('admin/pembesuk/detail_modal', { 
                layout: layout,
                title: 'Halaman Pembesuk',
                userRole: req.session.user.role,
                user: req.session.user,
                pembesuk, 
                pembesuks: rows})
        }
    });
    },

    edit: (req, res) => {
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pembesuk/edit_modal', { data:''})
        } else {
            const nik = parseInt(req.params.nik);
            const pembesuk = rows.find(pembesuk => pembesuk.nik === nik);
            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('admin/pembesuk/edit_modal', { 
                layout: layout,
                title: 'Halaman Pembesuk',
                userRole: req.session.user.role,
                user: req.session.user,
                pembesuk, 
                pembesuks: rows})
        }
    });

    
}  ,



add: async(req, res) => {
    const {nik, nama, tmp_lahir, jns_kelamin, pekerjaan, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan} = req.body;
    const form_pembesuk = {
        nik,
        nama_pembesuk : nama,
        tmp_lahir,
        jns_kelamin,
        pekerjaan,
        provinsi,
        kabupaten,
        kecamatan,
        kelurahan,
        kewarganegaraan,
    }
        // Validasi nik
    if (!/^\d{16,}$/.test(nik)) {
        req.session.message = {
            type: 'error',
            text: 'NIk harus terdiri dari minimal 16 digit angka.'
        };
        return res.redirect('/pembesuk');
    }

    try {

        console.log(form_pembesuk);
        // Menyimpan data ke database
        await pembesuk.insertData(req.db, form_pembesuk);

        req.session.message = {
            type: 'success',
            text: 'Data berhasil dimasukkan ke database'
        };
        res.redirect('/pembesuk');
    
    } catch (err) {
        console.error('Error detail:', err);
        req.session.message = {
            type: 'error',
            text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
        };
        res.redirect('/pembesuk');
    }
},
    
    
// update: (req, res) => {
//     const {nik, nama_pembesuk, tmp_lahir, jns_kelamin, pekerjaan, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan} = req.body;
//     const form_pembesuk = {
//             nik,
//             nama_pembesuk,
//             tmp_lahir,
//             jns_kelamin,
//             pekerjaan,
//             provinsi,
//             kabupaten,
//             kecamatan,
//             kelurahan,
//             kewarganegaraan,
//         }
    
//     console.log(form_pembesuk);
//     pembesuk.updateData(req.db, nik, form_pembesuk, (err, result) => {
//             if (err) {
//                 req.flash('error','Error Ketika Memasukkan Data', err.message);
//                 res.redirect('/pembesuk');
//             } else {
//                 req.flash('succes','Data Berhasil diUpdate');
//                 res.redirect('/pembesuk');
//             }
//         })
//     },

 update: async (req, res) => {
    const {nik, nama_pembesuk, tmp_lahir, jns_kelamin, pekerjaan, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan} = req.body;
    const form_pembesuk = {
            nik,
            nama_pembesuk,
            tmp_lahir,
            jns_kelamin,
            pekerjaan,
            provinsi,
            kabupaten,
            kecamatan,
            kelurahan,
            kewarganegaraan,
        }
    

    console.log(form_pembesuk);

    try {
        // Mengupdate data dengan menggunakan async/await
        await pembesuk.updateData(req.db, nik, form_pembesuk);
        
        req.session.message = {
            type: 'success',
            text: 'Data berhasil terUpdate'
        };
        res.redirect('/pembesuk');
    } catch (err) {
        console.error('Error detail:', err);
        req.session.message = {
            type: 'error',
            text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
        };
        res.redirect('/pembesuk');
    }
},

    delete : (req, res) => {
        const nik = parseInt(req.params.nik); // Mengambil nik dari parameter URL
        console.log(nik);
        pembesuk.deleteData(req.db, nik, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/pembesuk');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/pembesuk');
        }
    })
    },
}