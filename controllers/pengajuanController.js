const pengajuan = require('../models/pengajuanModel');
const path = require('path');
const multer = require('multer');

// Konfigurasi penyimpanan Foto KTp
const storagePengajuan = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'pengajuan')); // Pastikan path sesuai
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Penamaan file unik
  }
});

const uploadPengajuan = multer({ 
  storage: storagePengajuan,
  limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file maksimal 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipe File tidak Valid. Hanya boleh mengupload file JPEG, PNG, dan GIF.'));
    }
  }
});

module.exports = {


    indexAdmin: (req, res) => {
        // Ambil data surat
        pengajuan.fetchData(req.db, (errpengajuan, rowsPengajuan) => {
            if (errpengajuan) {
                req.flash('error', errpengajuan.message);
                return res.render('admin/pengajuan/index', { pengajuans: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            pengajuan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/pengajuan/index', { pengajuans: rowsPengajuan, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                pengajuan.fetchDataWithTahanan(req.db, (errWithTahanan, rowsWithTahanan) => {
                    if (errWithTahanan) {
                        req.flash('error', errWithTahanan.message);
                        return res.render('admin/pengajuan/index', { pengajuans: rowsWithTahanan, tahanans: rowsTahanan, withTahanan: [] });
                    }

                    const userRole = req.session.user.role; // Assuming role is stored in req.user
                    
                    let viewName;  // Variabel untuk menentukan view yang akan dirender
                    let layout;
                        if (userRole === 'admin') {
                            viewName = 'admin/pengajuan/index';
                            layout = 'layout/admin/main';
                        } else if (userRole === 'staff') {
                            viewName = 'admin/pengajuan/index';
                            layout = 'layout/staff/main';
                        } else {
                            viewName = 'public/pengajuan/index';
                            layout = 'layout/public/main';
                    }

                    // Render view dengan ketiga data
                    res.render(viewName, {
                        layout: layout,
                        title: 'Halaman pengajuan',
                        pengajuans: rowsPengajuan,
                        user: req.session.user,
                        userRole: req.session.user.role,
                        tahanans: rowsTahanan,
                        allPengajuans: rowsWithTahanan
                    });
                });
            });
        });
    },

    index: (req, res) => {
    const userEmail = req.session.user.email;

    pengajuan.fetchDataByEmail(req.db, userEmail, (errPengajuan, rowsPengajuan) => {
        if (errPengajuan) {
            req.flash('error', errPengajuan.message);
            return res.render('admin/pengajuan/index', { pengajuans: [], tahanans: [], pembesuks: [] });
        }

        pengajuan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
            if (errTahanan) {
                req.flash('error', errTahanan.message);
                return res.render('admin/pengajuan/index', { pengajuans: rowsPengajuan, tahanans: [], pembesuks: [] });
            }

            pengajuan.fetchDataWithTahanan(req.db, (errWithTahanan, rowsWithTahanan) => {
                if (errWithTahanan) {
                    req.flash('error', errWithTahanan.message);
                    return res.render('admin/pengajuan/index', { pengajuans: rowsWithTahanan, tahanans: rowsTahanan, withTahanan: [] });
                }

                const userRole = req.session.user.role;
                let viewName;
                let layout;
                if (userRole === 'admin') {
                    viewName = 'admin/pengajuan/index';
                    layout = 'layout/admin/main';
                } else if (userRole === 'staff') {
                    viewName = 'admin/pengajuan/index';
                    layout = 'layout/staff/main';
                } else {
                    viewName = 'public/pengajuan/index';
                    layout = 'layout/public/main';
                }

                res.render(viewName, {
                    layout: layout,
                    title: 'Halaman pengajuan',
                    pengajuans: rowsPengajuan,
                    user: req.session.user,
                    userRole: req.session.user.role,
                    tahanans: rowsTahanan,
                    withTahanans: rowsWithTahanan
                });
            });
        });
    });
},

 
    // detail: (req, res) => {
    //  pengajuan.fetchData(req.db, (err, rows) => {
    //     if (err) {
    //         req.flash('error', err.message); 
    //         res.render('admin/pengajuan/detail_modal', { data:''})
    //     } else {
    //         const id = parseInt(req.params.id);
    //         const pengajuan = rows.find(pengajuan => pengajuan.id_pengajuan === id);

            
    //         const userRole = req.session.user.role; // Assuming role is stored in req.user
    //         let viewName;
    //         let layout;
    //         if (userRole === 'admin') {
    //             viewName = 'admin/pengajuan/detail_modal';
    //             layout = 'layout/admin/main';
    //         } else if (userRole === 'staff') {
    //             viewName = 'admin/pengajuan/detail_modal';
    //             layout = 'layout/staff/main';
    //         } else {
    //             viewName = 'public/pengajuan/detail_modal';
    //             layout = 'layout/public/main';
    //         }
    //         res.render(viewName, { 
    //             layout: layout,
    //             title: 'Halaman pengajuan',
    //             user: req.session.user,
    //             userRole: req.session.user.role,
    //             pengajuan, 
    //             pengajuans: rows})
    //     }
    // });
    // },
        detail: (req, res) => {
        // Ambil data surat
        pengajuan.fetchData(req.db, (errpengajuan, rowsPengajuan) => {
            if (errpengajuan) {
                req.flash('error', errpengajuan.message);
                return res.render('admin/pengajuan/index', { pengajuans: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            pengajuan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/pengajuan/index', { pengajuans: rowsPengajuan, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                pengajuan.fetchDataWithTahanan(req.db, (errWithTahanan, rowsWithTahanan) => {
                    if (errWithTahanan) {
                        req.flash('error', errWithTahanan.message);
                        return res.render('admin/pengajuan/index', { pengajuans: rowsWithTahanan, tahanans: rowsTahanan, withTahanan: [] });
                    }
                    const id = parseInt(req.params.id);
                    const pengajuan = rowsWithTahanan.find(pengajuan => pengajuan.id === id);

                    const userRole = req.session.user.role; // Assuming role is stored in req.user
                    
                    let viewName;  // Variabel untuk menentukan view yang akan dirender
                    let layout;
                        if (userRole === 'admin') {
                            viewName = 'admin/pengajuan/detail_modal';
                            layout = 'layout/admin/main';
                        } else if (userRole === 'staff') {
                            viewName = 'admin/pengajuan/detail_modal';
                            layout = 'layout/staff/main';
                        } else {
                            viewName = 'public/pengajuan/detail_modal';
                            layout = 'layout/public/main';
                    }

                    // Render view dengan ketiga data
                    res.render(viewName, {
                        layout: layout,
                        title: 'Halaman pengajuan',
                        pengajuans: rowsPengajuan,
                        pengajuan,
                        user: req.session.user,
                        userRole: req.session.user.role,
                        tahanans: rowsTahanan,
                        allPengajuans: rowsWithTahanan
                    });
                });
            });
        });
    },

    edit : (req, res) => {
        // Ambil data surat
        pengajuan.fetchData(req.db, (errpengajuan, rowsPengajuan) => {
            if (errpengajuan) {
                req.flash('error', errpengajuan.message);
                return res.render('admin/pengajuan/index', { pengajuans: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            pengajuan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/pengajuan/index', { pengajuans: rowsPengajuan, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                pengajuan.fetchDataWithTahanan(req.db, (errWithTahanan, rowsWithTahanan) => {
                    if (errWithTahanan) {
                        req.flash('error', errWithTahanan.message);
                        return res.render('admin/pengajuan/index', { pengajuans: rowsWithTahanan, tahanans: rowsTahanan, withTahanan: [] });
                    }
                    const id = parseInt(req.params.id);
                    const pengajuan = rowsWithTahanan.find(pengajuan => pengajuan.id === id);

                    const userRole = req.session.user.role; // Assuming role is stored in req.user
                    
                    let viewName;  // Variabel untuk menentukan view yang akan dirender
                    let layout;
                        if (userRole === 'admin') {
                            viewName = 'admin/pengajuan/edit_modal';
                            layout = 'layout/admin/main';
                        } else if (userRole === 'staff') {
                            viewName = 'admin/pengajuan/edit_modal';
                            layout = 'layout/staff/main';
                        } else {
                            viewName = 'public/pengajuan/edit_modal';
                            layout = 'layout/public/main';
                    }

                    // Render view dengan ketiga data
                    res.render(viewName, {
                        layout: layout,
                        title: 'Halaman pengajuan',
                        pengajuans: rowsPengajuan,
                        pengajuan,
                        user: req.session.user,
                        userRole: req.session.user.role,
                        tahanans: rowsTahanan,
                        allPengajuans: rowsWithTahanan
                    });
                });
            });
        });
    },


//     edit: (req, res) => {
//      pengajuan.fetchData(req.db, (err, rows) => {
//         if (err) {
//             req.flash('error', err.message); 
//             res.render('admin/pengajuan/edit_modal', { data:''})
//         } else {
//             const id = parseInt(req.params.id);
//             const pengajuan = rows.find(pengajuan => pengajuan.id === id);
//             const userRole = req.session.user.role; // Assuming role is stored in req.user
            
//             let layout;
//             if (userRole === 'admin') {
//                 layout = 'layout/admin/main';
//             } else if (userRole === 'staff') {
//                 layout = 'layout/staff/main';
//             } else {
//                 layout = 'layout/public/main';
//             }           
//             res.render('admin/pengajuan/edit_modal', { 
//                 layout: layout,
//                 title: layout,
//                 user: req.session.user,
//                 userRole: req.session.user.role,
//                 pengajuan, 
//                 pengajuans: rows})
//         }
//     });
// },

    add : async (req, res) => {
        try {
            console.log('File received:', req.file); // Periksa apakah file diterima
            console.log('Request body:', req.body);

            const {
                nama_pembesuk, alamat_pembesuk, pekerjaan_pembesuk, hubungan, registrasi_tahanan, nama_tahananx, tanggal_besuk, status_pengajuan} = req.body;

            const form_pengajuan = {
                nama_pembesuk, 
                alamat_pembesuk, 
                pekerjaan_pembesuk, 
                hubungan, 
                registrasi_tahanan, 
                nama_tahananx,
                tanggal_besuk, 
                pengajuan_by:  req.session.user.email,
                tgl_pengajuan: new Date(),
                status_pengajuan,
                gambar_ktp: req.file ? req.file.filename : null // Periksa apakah req.file berisi file
            };


            console.log(form_pengajuan);

            await pengajuan.insertData(req.db, form_pengajuan);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/pengajuan');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/pengajuan');
        }
    },

    addFoto : (req, res, next) => {
        uploadPengajuan.single('gambar_ktp')(req, res, (err) => {
        if (err) {
        // Menangani error berdasarkan tipe error dari Multer
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
            req.session.message = {
                type: 'error',
                text: 'Ukuran file terlalu besar. Ukuran Maksimal 2MB.'
            };
            } else {
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat mengupload file: ' + err.message
            };
            }
        } else {
            req.session.message = {
            type: 'error',
            text: 'Terjadi kesalahan: ' + err.message
            };
        }
        return res.redirect('/pengajuan');
        }
        // Lanjutkan ke proses penyimpanan data jika tidak ada error
        next();
    });
    },

    update: async (req, res) => {
        const {id, nama_pembesuk, alamat_pembesuk, pekerjaan_pembesuk, hubungan, registrasi_tahanan, nama_tahananx, tanggal_besuk, pengajuan_by, tgl_pengajuan, status_pengajuan, old_gambar_ktp} = req.body;
        // Check if a new image is uploaded

        console.log('Uploaded file:', req.file); // Debugging line
        const new_gambar_ktp = req.file ? req.file.filename : old_gambar_ktp;

        const form_pengajuan = {
            id, 
            nama_pembesuk, 
            alamat_pembesuk, 
            pekerjaan_pembesuk, 
            hubungan, 
            registrasi_tahanan, 
            nama_tahananx,
            tanggal_besuk,
            pengajuan_by, 
            tgl_pengajuan,
            status_pengajuan,
            gambar_ktp: new_gambar_ktp
        };

        console.log(form_pengajuan);

        try {
            // Mengupdate data dengan menggunakan async/await
            await pengajuan.updateData(req.db, id, form_pengajuan);
            
            req.session.message = {
                type: 'success',
                text: 'Data berhasil terUpdate'
            };
            res.redirect('/pengajuan');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
            };
            res.redirect('/pengajuan');
        }
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

    approvePengajuan: (db, pengajuanId, callback) => {
            // Call the updateStatus function from the model and pass 'approved' as the status
            pengajuan.updateStatus(db, pengajuanId, 'approved', (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            });
        },
    rejectPengajuan: (db, pengajuanId, callback) => {
            // Call the updateStatus function from the model and pass 'approved' as the status
            pengajuan.updateStatus(db, pengajuanId, 'rejected', (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            });
        },

}