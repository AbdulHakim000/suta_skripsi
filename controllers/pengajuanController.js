const pengajuan = require('../models/pengajuanModel');
const PDFDocument = require('pdfkit');
const db = require('../database/conn.js'); // Import konfigurasi database
const excel = require('exceljs');
const pool = require('../database/pool.js');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const twilio = require('twilio');
require('dotenv').config(); // Pastikan dotenv diinisialisasi jika menggunakan .env file
// Konfigurasi Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


const mysql = require('mysql');
const { promisify } = require('util');

// Buat koneksi dan promisify query
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'suta_db'
});

const query = promisify(connection.query).bind(connection);


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
    apiData : (req, res) => {
        const query = 'SELECT * FROM pengajuan_surat'

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            } else {
                res.json(result);
            }
        });
    },

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

    indexAdminBelum: (req, res) => {
        pengajuan.fetchDataBelum(req.db, (err, rows) => {
            if (err) {
                return res.render('admin/pengajuan/index', {
                    layout: 'layout/admin/main',
                    title: 'Halaman Pengajuan',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    error: 'Terjadi kesalahan saat mengambil data pengajuan.', // Menambahkan pesan error
                    allPengajuans: [] // Pastikan ini diset agar tidak undefined
                });
            } else {
                res.render('admin/pengajuan/indexBelum', {
                    layout: 'layout/admin/main',
                    title: 'Halaman Pengajuan',
                    allPengajuans: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                });
            }
        });
    },
    indexAdminTerima: (req, res) => {
        pengajuan.fetchDataTerima(req.db, (err, rows) => {
            if (err) {
                return res.render('admin/pengajuan/index', {
                    layout: 'layout/admin/main',
                    title: 'Halaman Pengajuan',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    error: 'Terjadi kesalahan saat mengambil data pengajuan.', // Menambahkan pesan error
                    allPengajuans: [] // Pastikan ini diset agar tidak undefined
                });
            } else {
                res.render('admin/pengajuan/indexTerima', {
                    layout: 'layout/admin/main',
                    title: 'Halaman Pengajuan',
                    allPengajuans: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                });
            }
        });
    },
    indexAdminTolak: (req, res) => {
        pengajuan.fetchDataTolak(req.db, (err, rows) => {
            if (err) {
                return res.render('admin/pengajuan/index', {
                    layout: 'layout/admin/main',
                    title: 'Halaman Pengajuan',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    error: 'Terjadi kesalahan saat mengambil data pengajuan.', // Menambahkan pesan error
                    allPengajuans: [] // Pastikan ini diset agar tidak undefined
                });
            } else {
                res.render('admin/pengajuan/indexTolak', {
                    layout: 'layout/admin/main',
                    title: 'Halaman Pengajuan',
                    allPengajuans: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                });
            }
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

    add : async (req, res) => {
        try {
            console.log('File received:', req.file); // Periksa apakah file diterima
            console.log('Request body:', req.body);

            const {
                nama_pembesuk, alamat_pembesuk, pekerjaan_pembesuk, hubungan, registrasi_tahanan, nama_tahananx, tanggal_besuk, status_pengajuan, nomor_hp} = req.body;

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
                nomor_hp,
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
        const {id, nama_pembesuk, alamat_pembesuk, pekerjaan_pembesuk, hubungan, registrasi_tahanan, nama_tahananx, tanggal_besuk, pengajuan_by, tgl_pengajuan, status_pengajuan,nomor_hp, old_gambar_ktp} = req.body;
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
            nomor_hp,
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
    updateAdmin: async (req, res) => {
        const {id, nama_pembesuk, alamat_pembesuk, pekerjaan_pembesuk, hubungan, registrasi_tahanan, nama_tahananx, tanggal_besuk, pengajuan_by, tgl_pengajuan, status_pengajuan,nomor_hp, old_gambar_ktp} = req.body;
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
            nomor_hp,
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
            res.redirect('/pengajuan/admin');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
            };
            res.redirect('/pengajuan/admin');
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

    // approvePengajuan: (db, pengajuanId, callback) => {
    //         // Call the updateStatus function from the model and pass 'approved' as the status
    //         pengajuan.updateStatus(db, pengajuanId, 'Diterima', (err, result) => {
    //             if (err) {
    //                 return callback(err, null);
    //             }
    //             callback(null, result);
    //         });
    //     },

    approvePengajuan: (db, pengajuanId, callback) => {
        // Perbarui status pengajuan menjadi 'Diterima'
        pengajuan.updateStatus(db, pengajuanId, 'Diterima', (err, result) => {
            if (err) {
                return callback(err, null);
            }

            // Setelah status diperbarui, ambil data pengajuan untuk mendapatkan nomor handphone
            pengajuan.getPengajuanById(db, pengajuanId, (err, pengajuanData) => {
                if (err) {
                    return callback(err, null);
                }

                const nomorHP = pengajuanData.nomor_hp; // Asumsikan kolom nomor_wa ada di tabel pengajuan_surat
                if (nomorHP.startsWith('0')) {
                    nomorWA = '+62' + nomorHP.slice(1);
                } else {
                    nomorWA = nomorHP; // Jika nomor sudah dalam format internasional, tidak perlu diubah
                }
                const namaTahanan = pengajuanData.nama_tahanan;
                const pesan = `Pengajuan surat izin besuk untuk tahanan ${namaTahanan} telah diterima, silahkan download surat diwebsite kami, terimakasih.`;

                // Kirim pesan WhatsApp melalui Twilio
                client.messages.create({
                    body: pesan,
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:${nomorWA}`
                }).then(message => {
                    console.log('Pesan WhatsApp berhasil dikirim:', message.sid);
                }).catch(err => {
                    console.error('Gagal mengirim pesan WhatsApp:', err);
                });

                callback(null, result);
            });
        });
    },

    // rejectPengajuan: (db, pengajuanId, callback) => {
    //         // Call the updateStatus function from the model and pass 'approved' as the status
    //         pengajuan.updateStatus(db, pengajuanId, 'Ditolak', (err, result) => {
    //             if (err) {
    //                 return callback(err, null);
    //             }
    //             callback(null, result);
    //         });
    //     },

    rejectPengajuan: (db, pengajuanId, callback) => {
        // Perbarui status pengajuan menjadi 'Diterima'
        pengajuan.updateStatus(db, pengajuanId, 'Ditolak', (err, result) => {
            if (err) {
                return callback(err, null);
            }

            // Setelah status diperbarui, ambil data pengajuan untuk mendapatkan nomor handphone
            pengajuan.getPengajuanById(db, pengajuanId, (err, pengajuanData) => {
                if (err) {
                    return callback(err, null);
                }

                const nomorHP = pengajuanData.nomor_hp; // Asumsikan kolom nomor_wa ada di tabel pengajuan_surat
                if (nomorHP.startsWith('0')) {
                    nomorWA = '+62' + nomorHP.slice(1);
                } else {
                    nomorWA = nomorHP; // Jika nomor sudah dalam format internasional, tidak perlu diubah
                }
                const namaTahanan = pengajuanData.nama_tahanan;
                const pesan = `Pengajuan surat izin besuk untuk tahanan ${namaTahanan} belum bisa kami proses, karena data yang anda masukkan tidak valid atau kurang lengkap.`;

                // Kirim pesan WhatsApp melalui Twilio
                client.messages.create({
                    body: pesan,
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:${nomorWA}`
                }).then(message => {
                    console.log('Pesan WhatsApp berhasil dikirim:', message.sid);
                }).catch(err => {
                    console.error('Gagal mengirim pesan WhatsApp:', err);
                });

                callback(null, result);
            });
        });
    },

    cetakLaporanPengajuan: async (req, res) => {

    function formatIndonesianDate(date) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${month} ${year}`;
    }
    const reportDir = path.join(__dirname, '../public/reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const outputPath = path.join(reportDir, 'laporan_pengajuan.pdf');
    const doc = new PDFDocument({
            size: [297 * 2.83465, 210 * 2.83465], // Menetapkan ukuran kertas menjadi 297mm x 210mm
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // bagian header
    const logoPath = path.join(__dirname, '../public/images/kejaksaan.png');
    doc.image(logoPath, 170, 40, { width: 140 })
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('KEJAKSAAN NEGERI BANJARMASIN', 300, 57);

    doc.fontSize(10)
        .font('Helvetica')
        .text('Jl. Brig Jend. Hasan Basri No.3, RW.02, Pangeran,', 340, 80);  
    doc.fontSize(10)
        .text('Kec. Banjarmasin Utara, Kota Banjarmasin, Kalimantan Selatan 70124', 300, 95);

    doc.moveTo(60, 130)
        .lineTo(800, 130)
        .stroke();
    doc.moveTo(60, 133)
        .lineTo(800, 133)
        .stroke();
        // bagian isi tabel

    doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('LAPORAN DATA PENGAJUAN', 360, 160)
        .moveDown();


    try {
        const result = await query('SELECT * FROM pengajuan_surat');
        console.log('Query result:', result);
        const pengajuans = result;

        if (!Array.isArray(pengajuans)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [26, 110, 80,80,120, 95,80,80,]; // Lebar setiap kolom
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0) + 60; // Total lebar tabel
        const lastKolomx = 740; // posisi x akhir kolom Pangkat

        // Fungsi untuk menggambar garis horizontal
        function drawHorizontalLine(y) {
            doc.moveTo(60, y)
                .lineTo(lastKolomx, y, y)
                .stroke();
        }

        // Fungsi untuk menggambar garis vertikal
        function drawVerticalLine(x) {
            doc.moveTo(x, tableTop - 10)
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (pengajuans.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Nama Pembesuk', 100, tableTop)
                .text('Pekerjaan', 210, tableTop)
                .text('Hubungan', 300, tableTop)
                .text('Registrasi Tahanan', 380, tableTop)
                .text('Tanggal Besuk', 500, tableTop)
                .text('Diajukan Oleh', 583, tableTop)
                .text('Status', 680, tableTop);
    

            drawHorizontalLine(tableTop + 15); // Garis bawah header
            drawHorizontalLine(tableTop + -10); // Garis bawah header

            // Garis vertikal kolom
            let x = 60;
            columnWidths.forEach((width) => {
                drawVerticalLine(x);
                x += width;
            });
            // Garis vertikal penutup di samping kolom Pangkat
            drawVerticalLine(lastKolomx);
            // Data tabel
            doc.font('Helvetica')
                .fontSize(5); // Ukuran font data tabel
            pengajuans.forEach((pengajuan, i) => {
                const y = tableTop + (i + 1) * rowSpacing;
                 const formattedTanggalBesuk = formatIndonesianDate(new Date(pengajuan.tanggal_besuk));
                doc.text(i + 1, 70, y)
                    .text(pengajuan.nama_pembesuk, 90,y)
                    .text(pengajuan.pekerjaan_pembesuk, 200,y)
                    .text(pengajuan.hubungan, 280,y)
                    .text(pengajuan.registrasi_tahanan, 376,y)
                    .text(formattedTanggalBesuk, 494,y)
                    .text(pengajuan.pengajuan_by, 580,y)
                    .text(pengajuan.status_pengajuan, 660,y);


                drawHorizontalLine(y + 14); // Garis bawah setiap baris data
            });
        }

        // Panggil fungsi untuk menggambar tabel
        drawTable();


        // footer tabel
        
        const currentDate = new Date();
        const formattedDate = formatIndonesianDate(currentDate);
        doc.fontSize(8)
             .text(`Banjarmasin, ${formattedDate}`, 560, 420 );
        doc.fontSize(8)
            .text('An. KEPALA KEJAKSAAN NEGERI BANJARMASIN', 520, 434);
        doc.fontSize(8)
            .text('An. KEPALA SEKSI TINDAK PIDANA UMUM', 530, 448);
        doc.fontSize(8)
            .text('HABIBI, S.H', 590, 520);
        doc.fontSize(8)
            .text('JAKSA MUDA Nip. 19820302 200912 1 003', 530, 534);
        
        const ttdPath = path.join(__dirname, '../public/images/ttd.png');
        doc.image(ttdPath, 550, 460, { width: 140 })

        doc.end();



    } catch (err) {
        console.error('Error fetching Pembesuk data:', err);
        res.status(500).send('Error generating PDF');
    }

    writeStream.on('finish', () => {
        try {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="laporan_jaksa.pdf"');

            const fileStream = fs.createReadStream(outputPath);
            fileStream.pipe(res);

            fileStream.on('end', () => {
                fs.unlink(outputPath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });

        } catch (err) {
            console.error('Error during PDF generation:', err);
            res.status(500).send('Error generating PDF');
        }
    });
},






   cetakLaporanPengajuanBelum: async (req, res) => {

    function formatIndonesianDate(date) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${month} ${year}`;
    }
    const reportDir = path.join(__dirname, '../public/reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const outputPath = path.join(reportDir, 'laporan_pengajuan.pdf');
    const doc = new PDFDocument({
            size: [297 * 2.83465, 210 * 2.83465], // Menetapkan ukuran kertas menjadi 297mm x 210mm
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // bagian header
    const logoPath = path.join(__dirname, '../public/images/kejaksaan.png');
    doc.image(logoPath, 170, 40, { width: 140 })
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('KEJAKSAAN NEGERI BANJARMASIN', 300, 57);

    doc.fontSize(10)
        .font('Helvetica')
        .text('Jl. Brig Jend. Hasan Basri No.3, RW.02, Pangeran,', 340, 80);  
    doc.fontSize(10)
        .text('Kec. Banjarmasin Utara, Kota Banjarmasin, Kalimantan Selatan 70124', 300, 95);

    doc.moveTo(60, 130)
        .lineTo(800, 130)
        .stroke();
    doc.moveTo(60, 133)
        .lineTo(800, 133)
        .stroke();
        // bagian isi tabel

    doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('LAPORAN DATA PENGAJUAN BELUM DIPROSES', 360, 160)
        .moveDown();


    try {
        const result = await query("SELECT * FROM pengajuan_surat WHERE status_pengajuan = 'Belum Diproses'");
        console.log('Query result:', result);
        const pengajuans = result;

        if (!Array.isArray(pengajuans)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [26, 110, 80,80,120, 95,80,80,]; // Lebar setiap kolom
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0) + 60; // Total lebar tabel
        const lastKolomx = 740; // posisi x akhir kolom Pangkat

        // Fungsi untuk menggambar garis horizontal
        function drawHorizontalLine(y) {
            doc.moveTo(60, y)
                .lineTo(lastKolomx, y, y)
                .stroke();
        }

        // Fungsi untuk menggambar garis vertikal
        function drawVerticalLine(x) {
            doc.moveTo(x, tableTop - 10)
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (pengajuans.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Nama Pembesuk', 100, tableTop)
                .text('Pekerjaan', 210, tableTop)
                .text('Hubungan', 300, tableTop)
                .text('Registrasi Tahanan', 380, tableTop)
                .text('Tanggal Besuk', 500, tableTop)
                .text('Diajukan Oleh', 583, tableTop)
                .text('Status', 680, tableTop);
    

            drawHorizontalLine(tableTop + 15); // Garis bawah header
            drawHorizontalLine(tableTop + -10); // Garis bawah header

            // Garis vertikal kolom
            let x = 60;
            columnWidths.forEach((width) => {
                drawVerticalLine(x);
                x += width;
            });
            // Garis vertikal penutup di samping kolom Pangkat
            drawVerticalLine(lastKolomx);
            // Data tabel
            doc.font('Helvetica')
                .fontSize(5); // Ukuran font data tabel
            pengajuans.forEach((pengajuan, i) => {
                const y = tableTop + (i + 1) * rowSpacing;
                 const formattedTanggalBesuk = formatIndonesianDate(new Date(pengajuan.tanggal_besuk));
                doc.text(i + 1, 70, y)
                    .text(pengajuan.nama_pembesuk, 90,y)
                    .text(pengajuan.pekerjaan_pembesuk, 200,y)
                    .text(pengajuan.hubungan, 280,y)
                    .text(pengajuan.registrasi_tahanan, 376,y)
                    .text(formattedTanggalBesuk, 494,y)
                    .text(pengajuan.pengajuan_by, 580,y)
                    .text(pengajuan.status_pengajuan, 660,y);


                drawHorizontalLine(y + 14); // Garis bawah setiap baris data
            });
        }

        // Panggil fungsi untuk menggambar tabel
        drawTable();


        // footer tabel
        
        const currentDate = new Date();
        const formattedDate = formatIndonesianDate(currentDate);
        doc.fontSize(8)
             .text(`Banjarmasin, ${formattedDate}`, 560, 420 );
        doc.fontSize(8)
            .text('An. KEPALA KEJAKSAAN NEGERI BANJARMASIN', 520, 434);
        doc.fontSize(8)
            .text('An. KEPALA SEKSI TINDAK PIDANA UMUM', 530, 448);
        doc.fontSize(8)
            .text('HABIBI, S.H', 590, 520);
        doc.fontSize(8)
            .text('JAKSA MUDA Nip. 19820302 200912 1 003', 530, 534);
        
        const ttdPath = path.join(__dirname, '../public/images/ttd.png');
        doc.image(ttdPath, 550, 460, { width: 140 })

        doc.end();



    } catch (err) {
        console.error('Error fetching Pembesuk data:', err);
        res.status(500).send('Error generating PDF');
    }

    writeStream.on('finish', () => {
        try {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="laporan_jaksa.pdf"');

            const fileStream = fs.createReadStream(outputPath);
            fileStream.pipe(res);

            fileStream.on('end', () => {
                fs.unlink(outputPath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });

        } catch (err) {
            console.error('Error during PDF generation:', err);
            res.status(500).send('Error generating PDF');
        }
    });
},

   cetakLaporanPengajuanTerima: async (req, res) => {

    function formatIndonesianDate(date) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${month} ${year}`;
    }
    const reportDir = path.join(__dirname, '../public/reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const outputPath = path.join(reportDir, 'laporan_pengajuan.pdf');
    const doc = new PDFDocument({
            size: [297 * 2.83465, 210 * 2.83465], // Menetapkan ukuran kertas menjadi 297mm x 210mm
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // bagian header
    const logoPath = path.join(__dirname, '../public/images/kejaksaan.png');
    doc.image(logoPath, 170, 40, { width: 140 })
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('KEJAKSAAN NEGERI BANJARMASIN', 300, 57);

    doc.fontSize(10)
        .font('Helvetica')
        .text('Jl. Brig Jend. Hasan Basri No.3, RW.02, Pangeran,', 340, 80);  
    doc.fontSize(10)
        .text('Kec. Banjarmasin Utara, Kota Banjarmasin, Kalimantan Selatan 70124', 300, 95);

    doc.moveTo(60, 130)
        .lineTo(800, 130)
        .stroke();
    doc.moveTo(60, 133)
        .lineTo(800, 133)
        .stroke();
        // bagian isi tabel

    doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('LAPORAN DATA PENGAJUAN DITERIMA', 360, 160)
        .moveDown();


    try {
        const result = await query("SELECT * FROM pengajuan_surat WHERE status_pengajuan = 'Diterima'");
        console.log('Query result:', result);
        const pengajuans = result;

        if (!Array.isArray(pengajuans)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [26, 110, 80,80,120, 95,80,80,]; // Lebar setiap kolom
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0) + 60; // Total lebar tabel
        const lastKolomx = 740; // posisi x akhir kolom Pangkat

        // Fungsi untuk menggambar garis horizontal
        function drawHorizontalLine(y) {
            doc.moveTo(60, y)
                .lineTo(lastKolomx, y, y)
                .stroke();
        }

        // Fungsi untuk menggambar garis vertikal
        function drawVerticalLine(x) {
            doc.moveTo(x, tableTop - 10)
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (pengajuans.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Nama Pembesuk', 100, tableTop)
                .text('Pekerjaan', 210, tableTop)
                .text('Hubungan', 300, tableTop)
                .text('Registrasi Tahanan', 380, tableTop)
                .text('Tanggal Besuk', 500, tableTop)
                .text('Diajukan Oleh', 583, tableTop)
                .text('Status', 680, tableTop);
    

            drawHorizontalLine(tableTop + 15); // Garis bawah header
            drawHorizontalLine(tableTop + -10); // Garis bawah header

            // Garis vertikal kolom
            let x = 60;
            columnWidths.forEach((width) => {
                drawVerticalLine(x);
                x += width;
            });
            // Garis vertikal penutup di samping kolom Pangkat
            drawVerticalLine(lastKolomx);
            // Data tabel
            doc.font('Helvetica')
                .fontSize(5); // Ukuran font data tabel
            pengajuans.forEach((pengajuan, i) => {
                const y = tableTop + (i + 1) * rowSpacing;
                 const formattedTanggalBesuk = formatIndonesianDate(new Date(pengajuan.tanggal_besuk));
                doc.text(i + 1, 70, y)
                    .text(pengajuan.nama_pembesuk, 90,y)
                    .text(pengajuan.pekerjaan_pembesuk, 200,y)
                    .text(pengajuan.hubungan, 280,y)
                    .text(pengajuan.registrasi_tahanan, 376,y)
                    .text(formattedTanggalBesuk, 494,y)
                    .text(pengajuan.pengajuan_by, 580,y)
                    .text(pengajuan.status_pengajuan, 660,y);


                drawHorizontalLine(y + 14); // Garis bawah setiap baris data
            });
        }

        // Panggil fungsi untuk menggambar tabel
        drawTable();


        // footer tabel
        
        const currentDate = new Date();
        const formattedDate = formatIndonesianDate(currentDate);
        doc.fontSize(8)
             .text(`Banjarmasin, ${formattedDate}`, 560, 420 );
        doc.fontSize(8)
            .text('An. KEPALA KEJAKSAAN NEGERI BANJARMASIN', 520, 434);
        doc.fontSize(8)
            .text('An. KEPALA SEKSI TINDAK PIDANA UMUM', 530, 448);
        doc.fontSize(8)
            .text('HABIBI, S.H', 590, 520);
        doc.fontSize(8)
            .text('JAKSA MUDA Nip. 19820302 200912 1 003', 530, 534);
        
        const ttdPath = path.join(__dirname, '../public/images/ttd.png');
        doc.image(ttdPath, 550, 460, { width: 140 })

        doc.end();



    } catch (err) {
        console.error('Error fetching Pembesuk data:', err);
        res.status(500).send('Error generating PDF');
    }

    writeStream.on('finish', () => {
        try {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="laporan_jaksa.pdf"');

            const fileStream = fs.createReadStream(outputPath);
            fileStream.pipe(res);

            fileStream.on('end', () => {
                fs.unlink(outputPath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });

        } catch (err) {
            console.error('Error during PDF generation:', err);
            res.status(500).send('Error generating PDF');
        }
    });
},

   cetakLaporanPengajuanTolak: async (req, res) => {

    function formatIndonesianDate(date) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${month} ${year}`;
    }
    const reportDir = path.join(__dirname, '../public/reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const outputPath = path.join(reportDir, 'laporan_pengajuan.pdf');
    const doc = new PDFDocument({
            size: [297 * 2.83465, 210 * 2.83465], // Menetapkan ukuran kertas menjadi 297mm x 210mm
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // bagian header
    const logoPath = path.join(__dirname, '../public/images/kejaksaan.png');
    doc.image(logoPath, 170, 40, { width: 140 })
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('KEJAKSAAN NEGERI BANJARMASIN', 300, 57);

    doc.fontSize(10)
        .font('Helvetica')
        .text('Jl. Brig Jend. Hasan Basri No.3, RW.02, Pangeran,', 340, 80);  
    doc.fontSize(10)
        .text('Kec. Banjarmasin Utara, Kota Banjarmasin, Kalimantan Selatan 70124', 300, 95);

    doc.moveTo(60, 130)
        .lineTo(800, 130)
        .stroke();
    doc.moveTo(60, 133)
        .lineTo(800, 133)
        .stroke();
        // bagian isi tabel

    doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('LAPORAN DATA PENGAJUAN DITOLAK', 360, 160)
        .moveDown();


    try {
        const result = await query("SELECT * FROM pengajuan_surat WHERE status_pengajuan = 'Ditolak'");
        console.log('Query result:', result);
        const pengajuans = result;

        if (!Array.isArray(pengajuans)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [26, 110, 80,80,120, 95,80,80,]; // Lebar setiap kolom
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0) + 60; // Total lebar tabel
        const lastKolomx = 740; // posisi x akhir kolom Pangkat

        // Fungsi untuk menggambar garis horizontal
        function drawHorizontalLine(y) {
            doc.moveTo(60, y)
                .lineTo(lastKolomx, y, y)
                .stroke();
        }

        // Fungsi untuk menggambar garis vertikal
        function drawVerticalLine(x) {
            doc.moveTo(x, tableTop - 10)
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (pengajuans.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Nama Pembesuk', 100, tableTop)
                .text('Pekerjaan', 210, tableTop)
                .text('Hubungan', 300, tableTop)
                .text('Registrasi Tahanan', 380, tableTop)
                .text('Tanggal Besuk', 500, tableTop)
                .text('Diajukan Oleh', 583, tableTop)
                .text('Status', 680, tableTop);
    

            drawHorizontalLine(tableTop + 15); // Garis bawah header
            drawHorizontalLine(tableTop + -10); // Garis bawah header

            // Garis vertikal kolom
            let x = 60;
            columnWidths.forEach((width) => {
                drawVerticalLine(x);
                x += width;
            });
            // Garis vertikal penutup di samping kolom Pangkat
            drawVerticalLine(lastKolomx);
            // Data tabel
            doc.font('Helvetica')
                .fontSize(5); // Ukuran font data tabel
            pengajuans.forEach((pengajuan, i) => {
                const y = tableTop + (i + 1) * rowSpacing;
                 const formattedTanggalBesuk = formatIndonesianDate(new Date(pengajuan.tanggal_besuk));
                doc.text(i + 1, 70, y)
                    .text(pengajuan.nama_pembesuk, 90,y)
                    .text(pengajuan.pekerjaan_pembesuk, 200,y)
                    .text(pengajuan.hubungan, 280,y)
                    .text(pengajuan.registrasi_tahanan, 376,y)
                    .text(formattedTanggalBesuk, 494,y)
                    .text(pengajuan.pengajuan_by, 580,y)
                    .text(pengajuan.status_pengajuan, 660,y);


                drawHorizontalLine(y + 14); // Garis bawah setiap baris data
            });
        }

        // Panggil fungsi untuk menggambar tabel
        drawTable();


        // footer tabel
        
        const currentDate = new Date();
        const formattedDate = formatIndonesianDate(currentDate);
        doc.fontSize(8)
             .text(`Banjarmasin, ${formattedDate}`, 560, 420 );
        doc.fontSize(8)
            .text('An. KEPALA KEJAKSAAN NEGERI BANJARMASIN', 520, 434);
        doc.fontSize(8)
            .text('An. KEPALA SEKSI TINDAK PIDANA UMUM', 530, 448);
        doc.fontSize(8)
            .text('HABIBI, S.H', 590, 520);
        doc.fontSize(8)
            .text('JAKSA MUDA Nip. 19820302 200912 1 003', 530, 534);
        
        const ttdPath = path.join(__dirname, '../public/images/ttd.png');
        doc.image(ttdPath, 550, 460, { width: 140 })

        doc.end();



    } catch (err) {
        console.error('Error fetching Pembesuk data:', err);
        res.status(500).send('Error generating PDF');
    }

    writeStream.on('finish', () => {
        try {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="laporan_jaksa.pdf"');

            const fileStream = fs.createReadStream(outputPath);
            fileStream.pipe(res);

            fileStream.on('end', () => {
                fs.unlink(outputPath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });

        } catch (err) {
            console.error('Error during PDF generation:', err);
            res.status(500).send('Error generating PDF');
        }
    });
},

cetakPDFSurat: async (req, res) => {

    function formatIndonesianDate(date) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName},${day} ${month} ${year}`;
    }

    const reportDir = path.join(__dirname, '../public/reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const outputPath = path.join(reportDir, 'laporan_jaksa.pdf');
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // bagian header
    const logoPath = path.join(__dirname, '../public/images/kejaksaan.png');
    doc.image(logoPath, 60, 40, { width: 140 })
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('KEJAKSAAN NEGERI BANJARMASIN', 166, 57);

    doc.fontSize(10)
        .font('Helvetica')
        .text('Jl. Brig Jend. Hasan Basri No.3, RW.02, Pangeran,', 220, 80);  
    doc.fontSize(10)
        .text('Kec. Banjarmasin Utara, Kota Banjarmasin, Kalimantan Selatan 70124', 173, 95);

    doc.moveTo(60, 130)
        .lineTo(540, 130)
        .stroke();
    doc.moveTo(60, 133)
        .lineTo(540, 133)
        .stroke();


    try {
        const id = parseInt(req.params.id);
        const result = await query("SELECT pengajuan_surat.*, tahanan.nama_tahanan, tahanan.tmp_lahir, tahanan.tgl_lahir, tahanan.jns_kelamin, tahanan.pekerjaan AS pekerjaan_tahanan, tahanan.perkara FROM pengajuan_surat INNER JOIN tahanan ON pengajuan_surat.registrasi_tahanan = tahanan.registrasi_tahanan");
        console.log('Query result:', result);
        const surat = result.find(s => s.id === id);

    

        // Fungsi untuk menggambar baris dan garis secara otomatis
       
            // title
            const a = 60;
            const b = 200;
            const c = 190;



            doc.text(':', c, 230)
            doc.text(':', c, 250)
            doc.text(':', c, 330)
            doc.text(':', c, 350)
            doc.text(':', c, 420)
            doc.text(':', c, 440)
            doc.text(':', c, 460)
            doc.text(':', c, 480)
            doc.text(':', c, 500)
            doc.text(':', c, 520)
            doc.text(':', c, 540)
            doc.text(':', c, 560)
    
            // title
            doc.font('Helvetica-Bold')
                .fontSize(14)
                .text('SURAT IZIN MENGUNJUNGI TAHANAN',180, 150)
                .text(surat.perkara,210, 170)
                .text('NOMOR: 0.3.10/                                                                         /2024',100, 170)
               
                .fontSize(14)
                .text('Data Pembesuk', a, 210)
                .fontSize(10)
                .font('Helvetica')

                .text('Nama', a, 230)
                .text('Alamat', a, 250)
                .text('Pekerjaan', a, 330)
                .text('Hubungan', a, 350)

                .fontSize(14)
                .font('Helvetica-Bold')
                .text('Data Tahanan', a, 400)
                .fontSize(10)
                .font('Helvetica')

                .text('Nama Lengkap', a, 420)
                .text('Tempat Lahir', a, 440)
                .text('Jenis Kelamin', a, 460)
                .text('Pekerjaan', a, 480)
                .text('Registrasi Tahanan', a, 500)
                .text('Keperluan', a, 520)
                .text('Izin Berlaku', a, 540)
                .text('Tanggal Besuk Pertama', a, 560)

            // isi data

            const tanggal1 = formatIndonesianDate(surat.tanggal_besuk);
            doc.font('Helvetica')
                .fontSize(10); // Ukuran font data tabel
                doc.text(surat.nama_pembesuk, b, 230)
                    .text(surat.alamat_pembesuk, b, 250)
       
                    .text(surat.pekerjaan_pembesuk, b, 330)
                    .text(surat.hubungan, b, 350)

                    .text(surat.nama_tahanan, b, 420)
                    .text(surat.tmp_lahir, b, 440)
                    .text(surat.jns_kelamin, b, 460)
                    .text(surat.pekerjaan_tahanan, b, 480)
                    .text(surat.registrasi_tahanan, b, 500)
                    .text('Bertamu, Mengirim pakaian, atau Makanan', b, 520)
                    .text('08.00 sampai dengan selesai', b, 540)
                    .text(tanggal1, b, 560);

    

        // footer tabel
        
        const currentDate = new Date();
        const formattedDate = formatIndonesianDate(currentDate);
        doc.fontSize(8)
             .text(`Banjarmasin, ${formattedDate}`, 344, 660 );
        doc.fontSize(8)
            .text('An. KEPALA KEJAKSAAN NEGERI BANJARMASIN', 320, 674);
        doc.fontSize(8)
            .text('An. KEPALA SEKSI TINDAK PIDANA UMUM', 330, 688);
        doc.fontSize(8)
            .text('HABIBI, S.H', 390, 760);
        doc.fontSize(8)
            .text('JAKSA MUDA Nip. 19820302 200912 1 003', 330, 774);
        
        const ttdPath = path.join(__dirname, '../public/images/ttd.png');
        doc.image(ttdPath, 340, 700, { width: 140 })

        doc.end();



    } catch (err) {
        console.error('Error fetching jaksa data:', err);
        res.status(500).send('Error generating PDF');
    }

    writeStream.on('finish', () => {
        try {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="laporan_Surat_Izin_Besuk.pdf"');

            const fileStream = fs.createReadStream(outputPath);
            fileStream.pipe(res);

            fileStream.on('end', () => {
                fs.unlink(outputPath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });

        } catch (err) {
            console.error('Error during PDF generation:', err);
            res.status(500).send('Error generating PDF');
        }
    });
},

    downloadExcel : async (req, res) => {
    try {
        // Buat workbook dan sheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Pengajuan');

        // Menambahkan header
        worksheet.columns = [
            { header: 'NO', key: 'NO', width: 20 },
            { header: 'Nama Pembesuk', key: 'nama_pembesuk', width: 30},
            { header: 'Pekerjaan', key: 'pekerjaan', width: 20 },
            { header: 'Hubungan', key: 'hubungan', width: 20 },
            { header: 'Registrasi Tahanan', key: 'registrasi', width: 20 },
            { header: 'Tanggal Besuk', key: 'tanggal_besuk', width: 20 },
            { header: 'Diajukan Oleh', key: 'diajukan', width: 20 },
            { header: 'Status', key: 'status', width: 20 },
        ];

        // Ambil data dari database
        const result = await pool.query("SELECT * FROM pengajuan_surat");
        const pengajuanData = result[0]; // Mengambil data dari hasil query

        // Menambahkan baris ke worksheet
        pengajuanData.forEach((pengajuan,i) => {
            worksheet.addRow({
                NO: i+1,
                nama_pembesuk: pengajuan.nama_pembesuk, // Pastikan nik dikonversi ke string
                pekerjaan: pengajuan.pekerjaan_pembesuk,
                hubungan: pengajuan.hubungan,
                registrasi: pengajuan.registrasi_tahanan,
                tanggal_besuk: pengajuan.tanggal_besuk,
                diajukan: pengajuan.pengajuan_by,
                status: pengajuan.status_pengajuan,
            });
        });

        // Set header untuk unduhan
        res.setHeader('Content-Disposition', 'attachment; filename=pengajuan_report.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Kirim file Excel sebagai respons
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel report:', error);
        res.status(500).send('Error generating Excel report');
    }
},

    downloadCSV: async (req, res) => {
        try {
            // Query untuk mengambil data dari tabel pengajuan
            const result = await pool.query("SELECT * FROM pengajuan_surat");
            const pengajuanData = result[0]; // Mengambil data dari hasil query

            // Definisikan fields untuk CSV
            const fields = [
                { label: 'Nama Pembesuk', value: 'nama_pembesuk' },
                { label: 'Pekerjaan', value: 'pekerjaan_pembesuk' },
                { label: 'Hubungan', value: 'hubungan' },
                { label: 'Registrasi Tahanan', value: 'registrasi_tahanan' },
                { label: 'Tanggal Besuk', value: 'tanggal_besuk' },
                { label: 'Dijukan Oleh', value: 'pengajuan_by' },
                { label: 'Status', value: 'status_pengajuan' },

                // Tambahkan fields lain sesuai dengan kolom di tabel pengajuan
            ];

            // Konversi data ke CSV
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(pengajuanData);

            // Set header untuk unduhan
            res.header('Content-Type', 'text/csv');
            res.attachment('pengajuan_report.csv');
            res.send(csv);
        } catch (error) {
            console.error('Error generating CSV report:', error);
            res.status(500).send('Error generating CSV report');
        }
    },
}