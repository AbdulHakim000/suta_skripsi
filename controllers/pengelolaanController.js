const pengelolaan = require('../models/pengelolaanModel');

module.exports = {
    // index: (req, res) => {
    //     pengelolaan.fetchData(req.db, (err, rows) => {
    //         if (err) {
    //             req.flash('error', err.message);
    //             res.render('pengelolaan/index', { data:'' });
    //         } else {
    //             res.render('pengelolaan/index', {
    //                 layout: 'layout/main',
    //                 title: 'Halaman pengelolaan',
    //                 pengelolaans: rows
    //             });
    //         }
    //     });
    // },
    index: (req, res) => {
        // ambil data pengelolaan
        pengelolaan.fetchData(req.db, (errPengelolaan, rowsPengelolaan) => {
            if (errPengelolaan) {
                req.flash('error', errPengelolaan.message);
                return res.render('pengelolaan/index', { pengelolaans: [], tahananas: [] });
            } 
            // ambil data tahanan
            pengelolaan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('pengelolaan/index', { pengelolaans: rowsPengelolaan, tahanans: [] });
                }
                // ambil data jaksa
                pengelolaan.fetchDataJaksa(req.db, (errJaksa, rowsJaksa) => {
                    if (errJaksa) {
                        req.flash('error', errJaksa.message);
                        return res.render('pengelolaan/index', { pengelolaans: rowsPengelolaan, tahanans: rowsTahanan, jaksa: [] });
                    }
                    // render view dengan ketiga data
                        res.render('pengelolaan/index', {
                            layout: 'layout/main',
                            title: 'Halaman pengelolaan',
                            pengelolaans: rowsPengelolaan,
                            tahanans: rowsTahanan,
                            jaksas: rowsJaksa
                });
            });
        });
    });
    },

    detail: (req, res) => {
     pengelolaan.fetchJoinedData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('pengelolaan/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const pengelolaan = rows.find(pengelolaan => pengelolaan.id === id);
            res.render('pengelolaan/detail_modal', { 
                layout: 'layout/main',
                title: 'Halaman pengelolaan',
                pengelolaan, 
                pengelolaans: rows})
        }
    });
    },

    // edit: (req, res) => {
    //     pengelolaan.fetchData(req.db, (errPengelolaan, rowsPengelolaan) => {
    //         if (errPengelolaan) {
    //             req.flash('error', errPengelolaan.message);
    //             return res.render('pengelolaan/edit_modal', { pengelolaans: [], tahananas: [] });
    //         } 
    //         pengelolaan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
    //             if (errTahanan) {
    //                 req.flash('error', errTahanan.message);
    //                 return res.render('pengelolaan/edit_modal', { pengelolaans: rowsPengelolaan, tahanans: [] });
    //             }
    //             const id = parseInt(req.params.id);
    //             const pengelolaan = rowsPengelolaan.find(pengelolaan =>  pengelolaan.id === id);
    //             res.render('pengelolaan/edit_modal', {
    //                 layout: 'layout/main',
    //                 title: 'Halaman pengelolaan',
    //                 pengelolaan,
    //                 pengelolaans: rowsPengelolaan,
    //                 tahanans: rowsTahanan
    //             });
    //         });
    //     });
    // },

    edit: (req, res) => {
        // ambil data pengelolaan
        pengelolaan.fetchData(req.db, (errPengelolaan, rowsPengelolaan) => {
            if (errPengelolaan) {
                req.flash('error', errPengelolaan.message);
                return res.render('pengelolaan/edit_modal', { pengelolaans: [], tahananas: [] });
            } 
            // ambil data tahanan
            pengelolaan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('pengelolaan/edit_modal', { pengelolaans: rowsPengelolaan, tahanans: [] });
                }
                // ambil data jaksa
                pengelolaan.fetchDataJaksa(req.db, (errJaksa, rowsJaksa) => {
                    if (errJaksa) {
                        req.flash('error', errJaksa.message);
                        return res.render('pengelolaan/edit_modal', { pengelolaans: rowsPengelolaan, tahanans: rowsTahanan, jaksa: [] });
                    }
                    const id = parseInt(req.params.id);
                    const pengelolaan = rowsPengelolaan.find(pengelolaan =>  pengelolaan.id === id);
                    // render view dengan ketiga data
                        res.render('pengelolaan/edit_modal', {
                            layout: 'layout/main',
                            title: 'Halaman pengelolaan',
                            pengelolaan,
                            pengelolaans: rowsPengelolaan,
                            tahanans: rowsTahanan,
                            jaksas: rowsJaksa
                });
            });
        });
    });
    },


add: (req, res) => {
    const {registrasi_perkara, registrasi_tahanan, kronologi, jaksa1, jaksa2, jaksa3, jaksa4, barang_bukti, melanggar_pasal, lapas, durasi_penahanan, tgl_penuntutan} = req.body;
    const form_pengelolaan = {
        registrasi_perkara, 
        registrasi_tahanan, 
        kronologi, 
        jaksa1, 
        jaksa2, 
        jaksa3, 
        jaksa4, 
        barang_bukti,
        melanggar_pasal, 
        lapas, 
        durasi_penahanan, 
        tgl_penuntutan
    }
    
    console.log(form_pengelolaan);

    pengelolaan.insertData(req.db, form_pengelolaan, (err, result) => {
            if (err) {
                req.flash('Error Ketika Memasukkan Data', err.message);
                res.redirect('/pengelolaan');   
            } else {
                req.flash('success', 'Data berhasil dimasukkan ke database');
                res.redirect('/pengelolaan');    
            }
        })
    },
    
    
    
update: (req, res) => {
    const {id, registrasi_perkara, registrasi_tahanan, kronologi, jaksa1, jaksa2, jaksa3, jaksa4, barang_bukti, melanggar_pasal, lapas, durasi_penahanan, tgl_penuntutan} = req.body;
    const form_pengelolaan = {
        id,
        registrasi_perkara, 
        registrasi_tahanan, 
        kronologi, 
        jaksa1, 
        jaksa2, 
        jaksa3, 
        jaksa4, 
        barang_bukti, 
        melanggar_pasal, 
        lapas, 
        durasi_penahanan, 
        tgl_penuntutan
        }
    
    console.log(form_pengelolaan);
    pengelolaan.updateData(req.db, id, form_pengelolaan, (err, result) => {
            if (err) {
                req.flash('error','Error Ketika Memasukkan Data', err.message);
                res.redirect('/pengelolaan');
            } else {
                req.flash('succes','Data Berhasil diUpdate');
                res.redirect('/pengelolaan');
            }
        })
    },


    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        pengelolaan.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/pengelolaan');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/pengelolaan');
        }
    })
    },
}