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

    index: (req, res) => {
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
                pengajuan.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('admin/pengajuan/index', { pengajuans: rowsPengajuan, tahanans: rowsTahanan, pembesuks: [] });
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
                        userRole: req.session.user.role,
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
            res.render('admin/pengajuan/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const pengajuan = rows.find(pengajuan => pengajuan.id_pengajuan === id);

            
            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let viewName;
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
            res.render(viewName, { 
                layout: layout,
                title: 'Halaman pengajuan',
                userRole: req.session.user.role,
                pengajuan, 
                pengajuans: rows})
        }
    });
    },

    edit: (req, res) => {
     pengajuan.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pengajuan/edit_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const pengajuan = rows.find(pengajuan => pengajuan.id_pengajuan === id);
            const userRole = req.session.user.role; // Assuming role is stored in req.user
            
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }           
            res.render('admin/pengajuan/edit_modal', { 
                layout: layout,
                title: layout,
                userRole: req.session.user.role,
                pengajuan, 
                pengajuans: rows})
        }
    });
}  ,

    add : async (req, res) => {
        try {
            console.log('File received:', req.file); // Periksa apakah file diterima
            console.log('Request body:', req.body);

            const {
                nik_pembesuk, nama_pembesuk, tmp_lahir_pembesuk, jns_kelamin_pembesuk, pekerjaan_pembesuk, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan, registrasi_tahanan, nama_tahanan, hubungan, status} = req.body;

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
                status,
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
        const {id_pengajuan, nik_pembesuk, nama_pembesuk, tmp_lahir_pembesuk,   jns_kelamin_pembesuk, pekerjaan_pembesuk, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan, registrasi_tahanan, nama_tahanan, hubungan, status, old_gambar_ktp} = req.body;
        // Check if a new image is uploaded

        console.log('Uploaded file:', req.file); // Debugging line
        const new_gambar_ktp = req.file ? req.file.filename : old_gambar_ktp;

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
            status,
            gambar_ktp: new_gambar_ktp
        };

        console.log(form_pengajuan);

        try {
            // Mengupdate data dengan menggunakan async/await
            await pengajuan.updateData(req.db, id_pengajuan, form_pengajuan);
            
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
}