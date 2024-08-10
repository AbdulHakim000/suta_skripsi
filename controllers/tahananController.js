const tahanan = require('../models/tahananModel');
const path = require('path');
const multer = require('multer');

// Konfigurasi penyimpanan Foto Jaksa
const storageTahanan = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'tahanan')); // Pastikan path sesuai
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Penamaan file unik
  }
});

const uploadTahanan = multer({ 
  storage: storageTahanan,
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


    add : async (req, res) => {
        try {
            console.log('File received:', req.file); // Periksa apakah file diterima
            console.log('Request body:', req.body);

            const {
                registrasi_tahanan, nama_tahanan, tgl_lahir, tmp_lahir, provinsi, kabupaten, kecamatan, kelurahan, agama, jns_kelamin, pekerjaan, pendidikan, perkara, kewarganegaraan, tgl_surat_tuntutan} = req.body;

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
                tgl_surat_tuntutan,
                gambar_tahanan: req.file ? req.file.filename : null // Periksa apakah req.file berisi file
            }

            console.log(form_tahanan);

            await tahanan.insertData(req.db, form_tahanan);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/tahanan');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/tahanan');
        }
    },

    addTahanan : (req, res, next) => {
        uploadTahanan.single('gambar_tahanan')(req, res, (err) => {
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
        return res.redirect('/tahanan');
        }
        // Lanjutkan ke proses penyimpanan data jika tidak ada error
        next();
    });
    },

    update: async (req, res) => {
        const {
            id, registrasi_tahanan,nama_tahanan, tgl_lahir,  tmp_lahir, provinsi, kabupaten, kecamatan, kelurahan, agama, jns_kelamin, pekerjaan, pendidikan, perkara, kewarganegaraan, tgl_surat_tuntutan, old_gambar_tahanan} = req.body;
        // Check if a new image is uploaded

        console.log('Uploaded file:', req.file); // Debugging line
        const new_gambar_tahanan = req.file ? req.file.filename : old_gambar_tahanan;

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
            tgl_surat_tuntutan,
            gambar_tahanan: new_gambar_tahanan
        };

        console.log(form_tahanan);

        try {
            // Mengupdate data dengan menggunakan async/await
            await tahanan.updateData(req.db, id, form_tahanan);
            
            req.session.message = {
                type: 'success',
                text: 'Data berhasil terUpdate'
            };
            res.redirect('/tahanan');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
            };
            res.redirect('/tahanan');
        }
    },

    // update: async (req, res) => {
    //     const {id, registrasi_tahanan,nama_tahanan, tgl_lahir,  tmp_lahir, provinsi, kabupaten, kecamatan, kelurahan, agama, jns_kelamin, pekerjaan, pendidikan, perkara, kewarganegaraan, tgl_surat_tuntutan} = req.body;
    //     const form_tahanan = {
    //         id,
    //         registrasi_tahanan,
    //         nama_tahanan, 
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

    //     console.log(form_tahanan);

    //     try {
    //         // Mengupdate data dengan menggunakan async/await
    //         await tahanan.updateData(req.db, id, form_tahanan);
            
    //         req.session.message = {
    //             type: 'success',
    //             text: 'Data berhasil terUpdate'
    //         };
    //         res.redirect('/tahanan');
    //     } catch (err) {
    //         console.error('Error detail:', err);
    //         req.session.message = {
    //             type: 'error',
    //             text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
    //         };
    //         res.redirect('/tahanan');
    //     }
    // },


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