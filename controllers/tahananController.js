const tahanan = require('../models/tahananModel');

module.exports = {
    index: (req, res) => {
        tahanan.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message);
                res.render('tahanan/index', { data:'' });
            } else {
                res.render('tahanan/index', {
                    layout: 'layout/main',
                    title: 'Halaman tahanan',
                    tahanans: rows
                });
            }
        });
    },

    detail: (req, res) => {
     tahanan.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('tahanan/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const tahanan = rows.find(tahanan => tahanan.id === id);
            res.render('tahanan/detail_modal', { 
                layout: 'layout/main',
                title: 'Halaman tahanan',
                tahanan, 
                tahanans: rows})
        }
    });
    },

    edit: (req, res) => {
     tahanan.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('tahanan/edit_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const tahanan = rows.find(tahanan => tahanan.id === id);
            res.render('tahanan/edit_modal', { 
                layout: 'layout/main',
                title: 'Halaman tahanan',
                tahanan, 
                tahanans: rows})
        }
    });

    
}  ,



add: (req, res) => {
    const {registrasi_tahanan, nama_tahanan, tgl_lahir, tmp_lahir, provinsi, kabupaten, kecamatan, kelurahan, agama, jns_kelamin, pekerjaan, pendidikan, perkara, kewarganegaraan, tgl_surat_tuntutan} = req.body;
    const form_tahanan = {
        registrasi_tahanan,
        nama_tahanan, 
        tgl_lahir,  
        tmp_lahir, 
        provinsi, 
        kabupaten, 
        kecamatan, 
        kelurahan, 
        agama, 
        jns_kelamin, 
        pekerjaan, 
        pendidikan, 
        perkara, 
        kewarganegaraan, 
        tgl_surat_tuntutan
    }
    
    console.log(form_tahanan);

    tahanan.insertData(req.db, form_tahanan, (err, result) => {
            if (err) {
                req.flash('Error Ketika Memasukkan Data', err.message);
                res.redirect('/tahanan');   
            } else {
                req.flash('success', 'Data berhasil dimasukkan ke database');
                res.redirect('/tahanan');    
            }
        })
    },
    
    
    
update: (req, res) => {
    const {id, registrasi_tahanan,nama_tahanan, tgl_lahir,  tmp_lahir, provinsi, kabupaten, kecamatan, kelurahan, agama, jns_kelamin, pekerjaan, pendidikan, perkara, kewarganegaraan, tgl_surat_tuntutan} = req.body;
    const form_tahanan = {
        id,
        registrasi_tahanan,
        nama_tahanan, 
        tgl_lahir,  
        tmp_lahir, 
        provinsi, 
        kabupaten, 
        kecamatan, 
        kelurahan, 
        agama, 
        jns_kelamin, 
        pekerjaan, 
        pendidikan, 
        perkara, 
        kewarganegaraan, 
        tgl_surat_tuntutan
        }
    
    console.log(form_tahanan);
    tahanan.updateData(req.db, id, form_tahanan, (err, result) => {
            if (err) {
                req.flash('error','Error Ketika Memasukkan Data', err.message);
                res.redirect('/tahanan');
            } else {
                req.flash('succes','Data Berhasil diUpdate');
                res.redirect('/tahanan');
            }
        })
    },


    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        tahanan.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/tahanan');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/tahanan');
        }
    })
    },
}