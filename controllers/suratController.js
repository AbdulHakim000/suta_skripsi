const surat = require('../models/suratModel');

module.exports = {


    // index: (req, res) => {
    //     surat.fetchData(req.db, (err, rows) => {
    //         if (err) {
    //             req.flash('error', err.message);
    //             res.render('surat/index', { data:'' });
    //         } else {
    //             res.render('surat/index', {
    //                 layout: 'layout/main',
    //                 title: 'Halaman Surat',
    //                 surats: rows
    //             });
    //         }
    //     });
    // },

    //     index: (req, res) => {
    //     // Ambil data surat
    //     surat.fetchData(req.db, (errSurat, rowsSurat) => {
    //         if (errSurat) {
    //             req.flash('error', errSurat.message);
    //             return res.render('surat/index', { surats: [], tahanans: [] });
    //         }

    //         // Ambil data tahanan
    //         surat.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
    //             if (errTahanan) {
    //                 req.flash('error', errTahanan.message);
    //                 return res.render('surat/index', { surats: rowsSurat, tahanans: [] });
    //             }

    //             // Render view dengan kedua data
    //             res.render('surat/index', {
    //                 layout: 'layout/main',
    //                 title: 'Halaman Surat',
    //                 surats: rowsSurat,
    //                 tahanans: rowsTahanan
    //             });
    //         });
    //     });
    // },

    index: (req, res) => {
        // Ambil data surat
        surat.fetchData(req.db, (errSurat, rowsSurat) => {
            if (errSurat) {
                req.flash('error', errSurat.message);
                return res.render('surat/index', { surats: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            surat.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('surat/index', { surats: rowsSurat, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                surat.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('surat/index', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: [] });
                    }

                    // Render view dengan ketiga data
                    res.render('surat/index', {
                        layout: 'layout/main',
                        title: 'Halaman Surat',
                        surats: rowsSurat,
                        tahanans: rowsTahanan,
                        pembesuks: rowsPembesuk
                    });
                });
            });
        });
    },



    detail: (req, res) => {
     surat.fetchJoinedData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('surat/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const surat = rows.find(surat => surat.id_surat === id);
            res.render('surat/detail_modal', { 
                layout: 'layout/main',
                title: 'Halaman Surat',
                surat, 
                surats: rows})
        }
    });
    },
    //     detail: (req, res) => {
    //     surat.fetchJoinedData(req.db, (err, rows) => {
    //         if (err) {
    //             req.flash('error', err.message); 
    //             res.render('surat/detail_modal', { data: '' });
    //         } else {
    //             const id = parseInt(req.params.id);
    //             const surat = rows.find(surat => surat.id_surat === id);
    //             res.render('surat/detail_modal', { 
    //                 layout: 'layout/main',
    //                 title: 'Halaman Surat',
    //                 surat, 
    //                 surats: rows
    //             });
    //         }
    //     });
    // },

    // edit: (req, res) => {
    //  surat.fetchData(req.db, (err, rows) => {
    //     if (err) {
    //         req.flash('error', err.message); 
    //         res.render('surat/edit_modal', { data:''})
    //     } else {
    //         const id = parseInt(req.params.id);
    //         const surat = rows.find(surat => surat.id_surat === id);
    //         res.render('surat/edit_modal', { 
    //             layout: 'layout/main',
    //             title: 'Halaman Surat',
    //             surat, 
    //             surats: rows})
    //     }
    // });

    
    // }  ,

    // Ambil data surat
    edit: (req, res) => {
       surat.fetchData(req.db, (errSurat, rowsSurat) => {
            if (errSurat) {
                req.flash('error', errSurat.message);
                return res.render('surat/edit_modal', { surats: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            surat.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('surat/edit_modal', { surats: rowsSurat, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                surat.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('surat/edit_modal', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: [] });
                    }
                    const id = parseInt(req.params.id);
                    const surat = rowsSurat.find(surat => surat.id_surat === id);
                    // Render view dengan ketiga data
                    res.render('surat/edit_modal', {
                        layout: 'layout/main',
                        title: 'Halaman Surat',
                        surat,
                        surats: rowsSurat,
                        tahanans: rowsTahanan,
                        pembesuks: rowsPembesuk
                    });
                });
            });
        });
    },



add: (req, res) => {
    const {nik, registrasi_tahanan, hubungan, tanggal1, tanggal2, pembuatan} = req.body;
    const form_surat = {
        nik,
        registrasi_tahanan,
        hubungan,
        tanggal1,
        tanggal2,
        pembuatan,
    }
    
    console.log(form_surat);

    surat.insertData(req.db, form_surat, (err, result) => {
            if (err) {
                req.flash('Error Ketika Memasukkan Data', err.message);
                res.redirect('/surat');   
            } else {
                req.flash('success', 'Data berhasil dimasukkan ke database');
                res.redirect('/surat');    
            }
        })
    },
    
    
    
update: (req, res) => {
    const {id_surat, nik, registrasi_tahanan, hubungan, tanggal1, tanggal2, pembuatan} = req.body;
    const form_surat = {
            id_surat,
            nik,
            registrasi_tahanan,
            hubungan,
            tanggal1,
            tanggal2,
            pembuatan,
        }
    
    console.log(form_surat);
    surat.updateData(req.db, id_surat, form_surat, (err, result) => {
            if (err) {
                req.flash('error','Error Ketika Memasukkan Data', err.message);
                res.redirect('/surat');
            } else {
                req.flash('succes','Data Berhasil diUpdate');
                res.redirect('/surat');
            }
        })
    },


    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        surat.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/surat');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/surat');
        }
    })
    },
}