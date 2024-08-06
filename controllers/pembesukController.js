const pembesuk = require('../models/pembesukModel');

module.exports = {
    index: (req, res) => {
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('pembesuk/index', { data:''})
        } else {
            res.render('pembesuk/index', { 
                layout: 'layout/main',
                title: 'Halaman Pembesuk',
                pembesuks: rows})
        }
    });
    },

    detail: (req, res) => {
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('pembesuk/detail_modal', { data:''})
        } else {
            const nik = parseInt(req.params.nik);
            const pembesuk = rows.find(pembesuk => pembesuk.nik === nik);
            res.render('pembesuk/detail_modal', { 
                layout: 'layout/main',
                title: 'Halaman Pembesuk',
                pembesuk, 
                pembesuks: rows})
        }
    });
    },

    edit: (req, res) => {
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('pembesuk/edit_modal', { data:''})
        } else {
            const nik = parseInt(req.params.nik);
            const pembesuk = rows.find(pembesuk => pembesuk.nik === nik);
            res.render('pembesuk/edit_modal', { 
                layout: 'layout/main',
                title: 'Halaman Pembesuk',
                pembesuk, 
                pembesuks: rows})
        }
    });

    
}  ,



add: (req, res) => {
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
    
    console.log(form_pembesuk);

        pembesuk.insertData(req.db, form_pembesuk, (err, result) => {
            if (err) {
                req.flash('Error Ketika Memasukkan Data', err.message);
                res.redirect('/pembesuk');   
            } else {
                req.flash('success', 'Data berhasil dimasukkan ke database');
                res.redirect('/pembesuk');    
            }
        })
    },
    
    
    
update: (req, res) => {
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
    pembesuk.updateData(req.db, nik, form_pembesuk, (err, result) => {
            if (err) {
                req.flash('error','Error Ketika Memasukkan Data', err.message);
                res.redirect('/pembesuk');
            } else {
                req.flash('succes','Data Berhasil diUpdate');
                res.redirect('/pembesuk');
            }
        })
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