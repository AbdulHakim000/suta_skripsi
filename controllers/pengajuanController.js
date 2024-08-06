const pengajuan = require('../models/pengajuanModel');

module.exports = {
    // index: (req, res) => {
    //     pengajuan.fetchData(req.db, (err, rows) => {
    //         if (err) {
    //             req.flash('error', err.message);
    //             res.render('pengajuan/index', { data:'' });
    //         } else {
    //             res.render('pengajuan/index', {
    //                 layout: 'layout/main',
    //                 title: 'Halaman pengajuan',
    //                 pengajuans: rows
    //             });
    //         }
    //     });
    // },
    index: (req, res) => {
        // Ambil data surat
        pengajuan.fetchData(req.db, (errpengajuan, rowsPengajuan) => {
            if (errpengajuan) {
                req.flash('error', errpengajuan.message);
                return res.render('pengajuan/index', { pengajuans: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            pengajuan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('pengajuan/index', { pengajuans: rowsPengajuan, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                pengajuan.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('pengajuan/index', { pengajuans: rowsPengajuan, tahanans: rowsTahanan, pembesuks: [] });
                    }

                    // Render view dengan ketiga data
                    res.render('pengajuan/index', {
                        layout: 'layout/main',
                        title: 'Halaman pengajuan',
                        pengajuans: rowsPengajuan,
                        tahanans: rowsTahanan,
                        pembesuks: rowsPembesuk
                    });
                });
            });
        });
    },

    detail: (req, res) => {
     pengajuan.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('pengajuan/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const pengajuan = rows.find(pengajuan => pengajuan.id_pengajuan === id);
            res.render('pengajuan/detail_modal', { 
                layout: 'layout/main',
                title: 'Halaman pengajuan',
                pengajuan, 
                pengajuans: rows})
        }
    });
    },

    edit: (req, res) => {
     pengajuan.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('pengajuan/edit_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const pengajuan = rows.find(pengajuan => pengajuan.id_pengajuan === id);
            res.render('pengajuan/edit_modal', { 
                layout: 'layout/main',
                title: 'Halaman pengajuan',
                pengajuan, 
                pengajuans: rows})
        }
    });

    
}  ,



add: (req, res) => {
    const {nik_pembesuk, nama_pembesuk, tmp_lahir_pembesuk, jns_kelamin_pembesuk, pekerjaan_pembesuk, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan, registrasi_tahanan, nama_tahanan, hubungan, status} = req.body;
    const form_pengajuan = {
        nik_pembesuk, 
        nama_pembesuk, 
        tmp_lahir_pembesuk, 
        jns_kelamin_pembesuk, 
        pekerjaan_pembesuk, 
        provinsi, 
        kabupaten, 
        kecamatan, 
        kelurahan, 
        kewarganegaraan, 
        registrasi_tahanan, 
        nama_tahanan, 
        hubungan, 
        status
    }
    
    console.log(form_pengajuan);

    pengajuan.insertData(req.db, form_pengajuan, (err, result) => {
            if (err) {
                req.flash('Error Ketika Memasukkan Data', err.message);
                res.redirect('/pengajuan');   
            } else {
                req.flash('success', 'Data berhasil dimasukkan ke database');
                res.redirect('/pengajuan');    
            }
        })
    },
    
    
    
update: (req, res) => {
    const {id_pengajuan, nik_pembesuk, nama_pembesuk, tmp_lahir_pembesuk, jns_kelamin_pembesuk, pekerjaan_pembesuk, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan, registrasi_tahanan, nama_tahanan, hubungan, status} = req.body;

    const form_pengajuan = {
        id_pengajuan, 
        nik_pembesuk, 
        nama_pembesuk, 
        tmp_lahir_pembesuk, 
        jns_kelamin_pembesuk, 
        pekerjaan_pembesuk, 
        provinsi, 
        kabupaten, 
        kecamatan, 
        kelurahan, 
        kewarganegaraan, 
        registrasi_tahanan, 
        nama_tahanan, 
        hubungan, 
        status
        }
    
    console.log(form_pengajuan);
    pengajuan.updateData(req.db, id_pengajuan, form_pengajuan, (err, result) => {
            if (err) {
                req.flash('error','Error Ketika Memasukkan Data', err.message);
                res.redirect('/pengajuan');
            } else {
                req.flash('succes','Data Berhasil diUpdate');
                res.redirect('/pengajuan');
            }
        })
    },


    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        pengajuan.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/pengajuan');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/pengajuan');
        }
    })
    },
}