const pengelolaan = require('../models/pengelolaanModel');
const path = require('path');
const multer = require('multer');

// Konfigurasi penyimpanan Foto barbuk
const storageBarbuk = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'barang_bukti')); // Pastikan path sesuai
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Penamaan file unik
  }
});

const uploadBarbuk = multer({ 
  storage: storageBarbuk,
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
    index: (req, res) => {
        // ambil data pengelolaan
        pengelolaan.fetchData(req.db, (errPengelolaan, rowsPengelolaan) => {
            if (errPengelolaan) {
                req.flash('error', errPengelolaan.message);
                return res.render('admin/pengelolaan/index', { pengelolaans: [], tahananas: [] });
            } 
            // ambil data tahanan
            pengelolaan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/pengelolaan/index', { pengelolaans: rowsPengelolaan, tahanans: [] });
                }
                // ambil data jaksa
                pengelolaan.fetchDataJaksa(req.db, (errJaksa, rowsJaksa) => {
                    if (errJaksa) {
                        req.flash('error', errJaksa.message);
                        return res.render('admin/pengelolaan/index', { pengelolaans: rowsPengelolaan, tahanans: rowsTahanan, jaksa: [] });
                    }

                    const userRole = req.session.user.role; // Assuming role is stored in req.user
                    let layout;
                    
                    if (userRole === 'admin') {
                        layout = 'layout/admin/main';
                    } else if (userRole === 'staff') {
                        layout = 'layout/staff/main';
                    } else {
                        layout = 'layout/public/main';
                    }
                    // render view dengan ketiga data
                        res.render('admin/pengelolaan/index', {
                            layout: layout,
                            title: 'Halaman pengelolaan',
                            userRole: req.session.user.role,
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
            res.render('admin/pengelolaan/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const pengelolaan = rows.find(pengelolaan => pengelolaan.id === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('admin/pengelolaan/detail_modal', { 
                layout: layout,
                title: 'Halaman pengelolaan',
                userRole: req.session.user.role,
                pengelolaan, 
                pengelolaans: rows})
        }
    });
    },


    edit: (req, res) => {
        // ambil data pengelolaan
        pengelolaan.fetchData(req.db, (errPengelolaan, rowsPengelolaan) => {
            if (errPengelolaan) {
                req.flash('error', errPengelolaan.message);
                return res.render('admin/pengelolaan/edit_modal', { pengelolaans: [], tahananas: [] });
            } 
            // ambil data tahanan
            pengelolaan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/pengelolaan/edit_modal', { pengelolaans: rowsPengelolaan, tahanans: [] });
                }
                // ambil data jaksa
                pengelolaan.fetchDataJaksa(req.db, (errJaksa, rowsJaksa) => {
                    if (errJaksa) {
                        req.flash('error', errJaksa.message);
                        return res.render('admin/pengelolaan/edit_modal', { pengelolaans: rowsPengelolaan, tahanans: rowsTahanan, jaksa: [] });
                    }
                    const id = parseInt(req.params.id);
                    const pengelolaan = rowsPengelolaan.find(pengelolaan =>  pengelolaan.id === id);
                    // render view dengan ketiga data
                        const userRole = req.session.user.role; // Assuming role is stored in req.user
                        let layout;
                        if (userRole === 'admin') {
                            layout = 'layout/admin/main';
                        } else if (userRole === 'staff') {
                            layout = 'layout/staff/main';
                        } else {
                            layout = 'layout/public/main';
                        }
                        res.render('admin/pengelolaan/edit_modal', {
                            layout: layout,
                            title: 'Halaman pengelolaan',
                            pengelolaan,
                            userRole: req.session.user.role,
                            pengelolaans: rowsPengelolaan,
                            tahanans: rowsTahanan,
                            jaksas: rowsJaksa
                });
            });
        });
    });
    },

    add : async (req, res) => {
        try {
            console.log('File received:', req.file); // Periksa apakah file diterima
            console.log('Request body:', req.body);

            const {
                registrasi_perkara, registrasi_tahanan, kronologi, jaksa1,   jaksa2, jaksa3, jaksa4, barang_bukti, melanggar_pasal, lapas, durasi_penahanan, tgl_penuntutan} = req.body;

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
                    tgl_penuntutan,
                    gambar_barbuk: req.file ? req.file.filename : null // Periksa apakah req.file berisi file
                 }

            console.log(form_pengelolaan);

            await pengelolaan.insertData(req.db, form_pengelolaan);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/pengelolaan');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/pengelolaan');
        }
    },

addFoto : (req, res, next) => {
        uploadBarbuk.single('gambar_barbuk')(req, res, (err) => {
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
        return res.redirect('/pengelolaan');
        }
        // Lanjutkan ke proses penyimpanan data jika tidak ada error
        next();
    });
    },
    

        update: async (req, res) => {
                const {id, registrasi_perkara, registrasi_tahanan, kronologi, jaksa1, jaksa2, jaksa3, jaksa4, barang_bukti, melanggar_pasal, lapas, durasi_penahanan, tgl_penuntutan, old_gambar_barbuk} = req.body;
                // Check if a new image is uploaded

                console.log('Uploaded file:', req.file); // Debugging line
                const new_gambar_barbuk = req.file ? req.file.filename : old_gambar_barbuk;

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
                    tgl_penuntutan,
                    gambar_barbuk: new_gambar_barbuk
                };

                console.log(form_pengelolaan);
                try {
                    // Mengupdate data dengan menggunakan async/await
                    await pengelolaan.updateData(req.db, id, form_pengelolaan);
                    
                    req.session.message = {
                        type: 'success',
                        text: 'Data berhasil terUpdate'
                    };
                    res.redirect('/pengelolaan');
                } catch (err) {
                    console.error('Error detail:', err);
                    req.session.message = {
                        type: 'error',
                        text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
                    };
                    res.redirect('/pengelolaan');
                }
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