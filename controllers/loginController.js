const user = require('../models/userModel');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt'); // Import bcrypt

// Konfigurasi penyimpanan Foto Jaksa
const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'user')); // Pastikan path sesuai
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Penamaan file unik
  }
});

const uploadUser = multer({ 
  storage: storageUser,
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
        loginPage: (req, res) => {
            res.render('login/index', { 
                session: req.session ,
                layout: 'layout/null',
                title: 'Halaman Login',
            });
        },
        registerPage: (req, res) => {
            res.render('register/index', { 
                session: req.session ,
                layout: 'layout/null',
                title: 'Halaman Login',
            });
        },

        login: async (req, res) => {
            try {
                const { email, password } = req.body;

                // Validasi email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    req.session.message = {
                        type: 'error',
                        text: 'Format email tidak valid'
                    };
                    return res.redirect('/user/login');
                }

                // Ambil data pengguna dari database
                const userData = await user.findByEmail(req.db, email);
                if (!userData) {
                    req.session.message = {
                        type: 'error',
                        text: 'Email atau password salah'
                    };
                    return res.redirect('/user/login');
                }

                // Verifikasi password
                const match = await bcrypt.compare(password, userData.password);
                if (!match) {
                    req.session.message = {
                        type: 'error',
                        text: 'Email atau password salah'
                    };
                    return res.redirect('/user/login');
                }

                // Set session user
                req.session.user = userData;
                // Tambahkan log untuk cek
                console.log('User logged in:', req.session.user);
                req.session.message = {
                    type: 'success',
                    text: 'Login berhasil'
                };

                // Redirect ke halaman index
                return res.redirect('/');
            } catch (err) {
                console.error('Error detail:', err);
                req.session.message = {
                    type: 'error',
                    text: 'Terjadi kesalahan saat login: ' + err.message
                };
                res.redirect('/user/login');
            }
        },

        loginProcces: async (req, res) => {
            try {
                const { email, password } = req.body;

                // Validasi email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    req.session.message = {
                        type: 'error',
                        text: 'Format email tidak valid'
                    };
                    return res.redirect('/login');
                }

                // Ambil data pengguna dari database
                const userData = await user.findByEmail(req.db, email);
                if (!userData) {
                    req.session.message = {
                        type: 'error',
                        text: 'Email atau password salah'
                    };
                    return res.redirect('/login');
                }

                // Verifikasi password
                const match = await bcrypt.compare(password, userData.password);
                if (!match) {
                    req.session.message = {
                        type: 'error',
                        text: 'Email atau password salah'
                    };
                    return res.redirect('/login');
                }

                // Set session user
                req.session.user = userData;
                // Tambahkan log untuk cek
                console.log('User logged in:', req.session.user);
                req.session.message = {
                    type: 'success',
                    text: 'Login berhasil'
                };

                // Redirect ke halaman index
                return res.redirect('/');
            } catch (err) {
                console.error('Error detail:', err);
                req.session.message = {
                    type: 'error',
                    text: 'Terjadi kesalahan saat login: ' + err.message
                };
                res.redirect('/login');
            }
        },

    index: (req, res) => {
        user.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message);
                res.render('user/index', { data:'' });
            } else {
                res.render('user/index', {
                    layout: 'layout/main',
                    title: 'Halaman user',
                    users: rows
                });
            }
        });
    },

    detail: (req, res) => {
     user.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('user/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const user = rows.find(user => user.id === id);
            res.render('user/detail_modal', { 
                layout: 'layout/main',
                title: 'Halaman user',
                user, 
                users: rows})
        }
    });
    },

    edit: (req, res) => {
     user.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('user/edit_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const user = rows.find(user => user.id === id);
            res.render('user/edit_modal', { 
                layout: 'layout/main',
                title: 'Halaman user',
                user, 
                users: rows})
        }
    });

    
}  ,


    add: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validasi email
            if (!emailRegex.test(email)) {
                req.session.message = {
                    type: 'error',
                    text: 'Format email tidak valid'
                };
                return res.redirect('/user');
            }

            // Validasi panjang password minimal 8 karakter
            if (password.length < 8) {
                req.session.message = {
                    type: 'error',
                    text: 'Password harus memiliki minimal 8 karakter'
                };
                return res.redirect('/user');
            }

            // Enkripsi password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const form_user = {
                username, 
                email, 
                password: hashedPassword, // Menggunakan password yang sudah dienkripsi
                role,
                created_at: new Date() // Mengisi otomatis created_at dengan tanggal dan waktu saat ini
            };

            console.log(form_user);

            await user.insertData(req.db, form_user);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/user');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/user');
        }
    },
    addRegister: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validasi email
            if (!emailRegex.test(email)) {
                req.session.message = {
                    type: 'error',
                    text: 'Format email tidak valid'
                };
                return res.redirect('/register');
            }

            // Validasi panjang password minimal 8 karakter
            if (password.length < 8) {
                req.session.message = {
                    type: 'error',
                    text: 'Password harus memiliki minimal 8 karakter'
                };
                return res.redirect('/register');
            }

            // Enkripsi password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const form_user = {
                username, 
                email, 
                password: hashedPassword, // Menggunakan password yang sudah dienkripsi
                role,
                created_at: new Date() // Mengisi otomatis created_at dengan tanggal dan waktu saat ini
            };

            console.log(form_user);

            await user.insertData(req.db, form_user);
            req.session.message = {
                type: 'success',
                text: 'Berhasil Mendaftar, Silahkan Login Kembali'
            };
            res.redirect('/login');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/register');
        }
    },

    adduser : (req, res, next) => {
        uploaduser.single('gambar_user')(req, res, (err) => {
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
        return res.redirect('/user');
        }
        // Lanjutkan ke proses penyimpanan data jika tidak ada error
        next();
    });
    },

    update: async (req, res) => {
        try {
            const {id, username, email, password, role } = req.body;
            console.log(req.body);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validasi email
            if (!emailRegex.test(email)) {
                req.session.message = {
                    type: 'error',
                    text: 'Format email tidak valid'
                };
                return res.redirect(`/user/`);
            }

            // Persiapkan objek untuk menyimpan perubahan data
            let form_user = {
                username,
                email,
                role,
                updated_at: new Date() // Mengisi otomatis updated_at dengan tanggal dan waktu saat ini
            };

            // Cek apakah password diubah
            if (password) {
                // Enkripsi password baru jika diubah
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                form_user.password = hashedPassword;
            }

            console.log(form_user);

            await user.updateData(req.db, id, form_user);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil diperbarui'
            };
            res.redirect('/user');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memperbarui data: ' + err.message
            };
            res.redirect(`/user/edit/${id}`);
        }
    },

    // update: async (req, res) => {
    //     const {id, registrasi_user,nama_user, tgl_lahir,  tmp_lahir, provinsi, kabupaten, kecamatan, kelurahan, agama, jns_kelamin, pekerjaan, pendidikan, perkara, kewarganegaraan, tgl_surat_tuntutan} = req.body;
    //     const form_user = {
    //         id,
    //         registrasi_user,
    //         nama_user, 
    //         tgl_lahir,  
    //         tmp_lahir, 
    //         provinsi, 
    //         kabupaten, 
    //         kecamatan, 
    //         kelurahan, 
    //         agama, 
    //         jns_kelamin, 
    //         pekerjaan, 
    //         pendidikan, 
    //         perkara, 
    //         kewarganegaraan, 
    //         tgl_surat_tuntutan
    //         }

    //     console.log(form_user);

    //     try {
    //         // Mengupdate data dengan menggunakan async/await
    //         await user.updateData(req.db, id, form_user);
            
    //         req.session.message = {
    //             type: 'success',
    //             text: 'Data berhasil terUpdate'
    //         };
    //         res.redirect('/user');
    //     } catch (err) {
    //         console.error('Error detail:', err);
    //         req.session.message = {
    //             type: 'error',
    //             text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
    //         };
    //         res.redirect('/user');
    //     }
    // },


    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        user.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/user');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/user');
        }
    })
    },
}