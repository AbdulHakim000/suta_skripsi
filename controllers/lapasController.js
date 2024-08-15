const lapas = require('../models/lapasModel');
const path = require('path');
const multer = require('multer');

// Konfigurasi penyimpanan Foto Jaksa
const storageLapas = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'lapas')); // Pastikan path sesuai
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Penamaan file unik
  }
});

const uploadLapas = multer({ 
  storage: storageLapas,
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

        const userRole = req.session.user.role; // Assuming role is stored in req.user
        let viewName;
        let layout;
            if (userRole === 'admin') {
                viewName = 'admin/lapas/index';
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                viewName = 'admin/lapas/index';
                layout = 'layout/staff/main';
            } else {
                viewName = 'public/lapas/index';
                layout = 'layout/public/main';
            }
        lapas.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message);
                res.render(viewName, { data:'' });
            } else {
                res.render(viewName, {
                    layout: layout,
                    user: req.session.user,
                    title: 'Halaman lapas',
                    lapass: rows
                });
            }
        });
    },
    tambah: (req, res) => {

        const userRole = req.session.user.role; // Assuming role is stored in req.user
        let viewName;
        let layout;
            if (userRole === 'admin') {
                viewName = 'admin/lapas/add_modal';
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                viewName = 'admin/lapas/add_modal';
                layout = 'layout/staff/main';
            } else {
                viewName = 'public/lapas/add_modal';
                layout = 'layout/public/main';
            }
        lapas.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message);
                res.render(viewName, { data:'' });
            } else {
                res.render(viewName, {
                    layout: layout,
                    user: req.session.user,
                    title: 'Halaman lapas',
                    lapass: rows
                });
            }
        });
    },

    detail: (req, res) => {
     lapas.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('lapas/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const lapas = rows.find(lapas => lapas.id === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let viewName;
            let layout;
            if (userRole === 'admin') {
                viewName = 'admin/lapas/detail_modal';
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                viewName = 'admin/lapas/detail_modal';
                layout = 'layout/staff/main';
            } else {
                viewName = 'public/lapas/detail_modal';
                layout = 'layout/public/main';
            }
            res.render(viewName, { 
                layout: layout,
                title: 'Halaman lapas',
                user: req.session.user,
                lapas, 
                lapass: rows})
        }
    });
    },

    edit: (req, res) => {
     lapas.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('lapas/edit_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const lapas = rows.find(lapas => lapas.id === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('admin/lapas/edit_modal', { 
                layout: layout,
                title: 'Halaman lapas',
                user: req.session.user,
                lapas, 
                lapass: rows})
        }
    });

    
}  ,


    add : async (req, res) => {
        try {
            console.log('File received:', req.file); // Periksa apakah file diterima
            console.log('Request body:', req.body);

            const {
                nama_lapas, alamat, link_maps} = req.body;

            const form_lapas = {
                nama_lapas, 
                alamat, 
                link_maps, 
                gambar_lapas: req.file ? req.file.filename : null // Periksa apakah req.file berisi file
            }

            console.log(form_lapas);

            await lapas.insertData(req.db, form_lapas);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/lapas');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/lapas');
        }
    },

    addFoto : (req, res, next) => {
        uploadLapas.single('gambar_lapas')(req, res, (err) => {
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
        return res.redirect('/lapas');
        }
        // Lanjutkan ke proses penyimpanan data jika tidak ada error
        next();
    });
    },

    update: async (req, res) => {
        const {
            id, nama_lapas, alamat, link_maps, old_gambar_lapas
        } = req.body;
        // Check if a new image is uploaded

        console.log('Uploaded file:', req.file); // Debugging line
        const new_gambar_lapas = req.file ? req.file.filename : old_gambar_lapas;

        const form_lapas = {
            id,
            nama_lapas, 
            alamat, 
            link_maps,
            gambar_lapas: new_gambar_lapas
        };

        console.log(form_lapas);

        try {
            // Mengupdate data dengan menggunakan async/await
            await lapas.updateData(req.db, id, form_lapas);
            
            req.session.message = {
                type: 'success',
                text: 'Data berhasil terUpdate'
            };
            res.redirect('/lapas');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
            };
            res.redirect('/lapas');
        }
    },

    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        lapas.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/lapas');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/lapas');
        }
    })
    },
}