const surat = require('../models/suratModel');

module.exports = {

    index: (req, res) => {
        // Ambil data surat
        surat.fetchDataWithTahanan(req.db, (errSurat, rowsSurat) => {
            if (errSurat) {
                req.flash('error', errSurat.message);
                return res.render('admin/surat/index', { surats: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            surat.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/surat/index', { surats: rowsSurat, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                surat.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('admin/surat/index', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: [] });
                    }

                    surat.fetchJoinedData(req.db, (errJoin, rowsJoin) => {
                        if (errJoin) {
                        req.flash('error', errJoin.message);
                        return res.render('admin/surat/index', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: rowsPembesuks, join: [] });
                    }

                    const user = req.user; // Pastikan user sudah didefinisikan
                    // Render view dengan ketiga data
                    const userRole = req.session.user.role; // Assuming role is stored in req.user

                        let layout;
                        if (userRole === 'admin') {
                            layout = 'layout/admin/main';
                        } else if (userRole === 'staff') {
                            layout = 'layout/staff/main';
                        } else {
                            layout = 'layout/public/main';
        }
                        res.render('admin/surat/index', {
                            layout: layout,
                            title: 'Halaman Surat',
                            user: req.session.user,
                            userRole: req.session.user.role,
                            surats: rowsSurat,
                            tahanans: rowsTahanan,
                            pembesuks: rowsPembesuk,
                            joins: rowsJoin
                        });
                    });
                });
            });
        });
    },
    tambah: (req, res) => {
        // Ambil data surat
        surat.fetchDataWithTahanan(req.db, (errSurat, rowsSurat) => {
            if (errSurat) {
                req.flash('error', errSurat.message);
                return res.render('admin/surat/add_modal', { surats: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            surat.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/surat/add_modal', { surats: rowsSurat, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                surat.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('admin/surat/add_modal', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: [] });
                    }

                    surat.fetchJoinedData(req.db, (errJoin, rowsJoin) => {
                        if (errJoin) {
                        req.flash('error', errJoin.message);
                        return res.render('admin/surat/add_modal', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: rowsPembesuks, join: [] });
                    }

                    const user = req.user; // Pastikan user sudah didefinisikan
                    // Render view dengan ketiga data
                    const userRole = req.session.user.role; // Assuming role is stored in req.user

                        let layout;
                        if (userRole === 'admin') {
                            layout = 'layout/admin/main';
                        } else if (userRole === 'staff') {
                            layout = 'layout/staff/main';
                        } else {
                            layout = 'layout/public/main';
        }
                        res.render('admin/surat/add_modal', {
                            layout: layout,
                            title: 'Halaman Surat',
                            user: req.session.user,
                            userRole: req.session.user.role,
                            surats: rowsSurat,
                            tahanans: rowsTahanan,
                            pembesuks: rowsPembesuk,
                            joins: rowsJoin
                        });
                    });
                });
            });
        });
    },



    detail: (req, res) => {
     surat.fetchJoinedData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/surat/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const surat = rows.find(surat => surat.id_surat === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('admin/surat/detail_modal', { 
                layout: layout,
                title: 'Halaman Surat',
                surat, 
                user: req.session.user,
                surats: rows})
        }
    });
    },


    // Ambil data surat
    edit: (req, res) => {
       surat.fetchData(req.db, (errSurat, rowsSurat) => {
            if (errSurat) {
                req.flash('error', errSurat.message);
                return res.render('admin/surat/edit_modal', { surats: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            surat.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/surat/edit_modal', { surats: rowsSurat, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                surat.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('admin/surat/edit_modal', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: [] });
                    }
                    const id = parseInt(req.params.id);
                    const surat = rowsSurat.find(surat => surat.id_surat === id);

                    const userRole = req.session.user.role; // Assuming role is stored in req.user
                    let layout;
                    if (userRole === 'admin') {
                        layout = 'layout/admin/main';
                    } else if (userRole === 'staff') {
                        layout = 'layout/staff/main';
                    } else {
                        layout = 'layout/public/main';
                    }
                    // Render view dengan ketiga data
                    res.render('admin/surat/edit_modal', {
                        layout: layout,
                        title: 'Halaman Surat',
                        surat,
                        surats: rowsSurat,
                        user: req.session.user,
                        userRole: req.session.user.role,
                        tahanans: rowsTahanan,
                        pembesuks: rowsPembesuk
                    });
                });
            });
        });
    },

    add: async  (req, res) =>{
         const {nik, registrasi_tahanan, hubungan, tanggal1, tanggal2, pembuatan} = req.body;
        const form_surat = {
            nik,
            registrasi_tahanan,
            hubungan,
            tanggal1,
            tanggal2,
            pembuatan,
        }

        try {
            console.log('form_surat')
            // menyimpan data ke database
            await surat.insertData(req.db, form_surat);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/surat');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/surat');
        }
    },
    
    
    update: async (req, res) => {
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

        try {
            // Mengupdate data dengan menggunakan async/await
            await surat.updateData(req.db, id_surat, form_surat);
            
            req.session.message = {
                type: 'success',
                text: 'Data berhasil terUpdate'
            };
            res.redirect('/surat');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
            };
            res.redirect('/surat');
        }
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