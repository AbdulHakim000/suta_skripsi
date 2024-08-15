const jaksa = require('../models/jaksaModel');
const path = require('path');
const multer = require('multer');

// Konfigurasi penyimpanan Foto Jaksa
const storageJaksa = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'jaksa')); // Pastikan path sesuai
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Penamaan file unik
  }
});

const uploadJaksa = multer({ 
  storage: storageJaksa,
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
        jaksa.fetchData(req.db, (err, rows) => {
            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            if (err) {
                req.flash('error', err.message);
                res.render('admin/jaksa/index', {
                    layout: layout,
                    title: 'Halaman jaksa',
                    jaksas: '',
                });
            } else {
                res.render('admin/jaksa/index', {
                    layout: layout,
                    title: 'Halaman jaksa',
                    jaksas: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                    messages: req.flash()
                });
            }
        });
    },
    tambah: (req, res) => {
        jaksa.fetchData(req.db, (err, rows) => {
            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            if (err) {
                req.flash('error', err.message);
                res.render('admin/jaksa/add_modal', {
                    layout: layout,
                    title: 'Halaman jaksa',
                    jaksas: '',
                });
            } else {
                res.render('admin/jaksa/add_modal', {
                    layout: layout,
                    title: 'Halaman jaksa',
                    jaksas: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                    messages: req.flash()
                });
            }
        });
    },

    detail: (req, res) => {
     jaksa.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/jaksa/detail_modal', { data:''})
        } else {
            const nip = req.params.nip;
            const jaksa = rows.find(jaksa => jaksa.nip === nip);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }

            res.render('admin/jaksa/detail_modal', { 
                layout: layout,
                title: 'Halaman jaksa',
                jaksa, 
                user: req.session.user,
                userRole: req.session.user.role,
                jaksas: rows})
        }
    });
    },

    edit: (req, res) => {
        jaksa.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message); 
                res.render('admin/jaksa/edit_modal', { data:''})
            } else {
                const nip = req.params.nip;

                console.log(nip);
                const jaksa = rows.find(j => j.nip === nip);

                const userRole = req.session.user.role; // Assuming role is stored in req.user
                let layout;
                if (userRole === 'admin') {
                    layout = 'layout/admin/main';
                } else if (userRole === 'staff') {
                    layout = 'layout/staff/main';
                } else {
                    layout = 'layout/public/main';
                }
                res.render('admin/jaksa/edit_modal', { 
                    layout: layout,
                    title: 'Halaman jaksa',
                    jaksa, 
                    user: req.session.user,
                    userRole: req.session.user.role,
                    jaksas: rows})
            }
        });
    }  ,


    add : async (req, res) => {
        try {
            console.log('File received:', req.file); // Periksa apakah file diterima
            console.log('Request body:', req.body);

            const { nip, nama, pangkat } = req.body;
            const form_jaksa = {
                nip,
                nama,
                pangkat,
                gambar_jaksa: req.file ? req.file.filename : null // Periksa apakah req.file berisi file
            };

            if (!/^\d{18,}$/.test(nip)) {
                req.session.message = {
                    type: 'error',
                    text: 'NIP harus terdiri dari minimal 18 digit angka.'
                };
                return res.redirect('/jaksa');
            }

            console.log(form_jaksa);

            await jaksa.insertData(req.db, form_jaksa);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/jaksa');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/jaksa');
        }
    },

    addJaksa : (req, res, next) => {
        uploadJaksa.single('gambar_jaksa')(req, res, (err) => {
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
        return res.redirect('/jaksa');
        }
        // Lanjutkan ke proses penyimpanan data jika tidak ada error
        next();
    });
    },
        
    

    update: async (req, res) => {
        const { nip, nama, pangkat, old_gambar_jaksa } = req.body;

        // Check if a new image is uploaded

        console.log('Uploaded file:', req.file); // Debugging line
        const new_gambar_jaksa = req.file ? req.file.filename : old_gambar_jaksa;

        const form_jaksa = {
            nip,
            nama,
            pangkat,
            gambar_jaksa: new_gambar_jaksa
        };

        console.log(form_jaksa);

        try {
            // Mengupdate data dengan menggunakan async/await
            await jaksa.updateData(req.db, nip, form_jaksa);
            
            req.session.message = {
                type: 'success',
                text: 'Data berhasil terUpdate'
            };
            res.redirect('/jaksa');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
            };
            res.redirect('/jaksa');
        }
    },


    delete : (req, res) => {
        const nip = req.params.nip; // Mengambil nip dari parameter URL
        console.log(nip);
        jaksa.deleteData(req.db, nip, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/jaksa');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/jaksa');
        }
    })
    },
}
