const tahanan = require('../models/tahananModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const excel = require('exceljs');
const pool = require('../database/pool.js');
const { Parser } = require('json2csv');
const path = require('path');
const multer = require('multer');

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

        const userRole = req.session.user.role; // Assuming role is stored in req.user
         
        let viewName;
        let layout;
            if (userRole === 'admin') {
                viewName = 'admin/tahanan/index';
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                viewName = 'admin/tahanan/index';
                layout = 'layout/staff/main';
            } else {
                viewName = 'public/tahanan/index';
                layout = 'layout/public/main';
            }
        tahanan.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message);
                res.render(viewName, { data:'' });
            } else {
                res.render(viewName, {
                    layout: layout,
                    title: 'Halaman tahanan',
                    userRole: req.session.user.role,
                    user: req.session.user,
                    tahanans: rows
                });
            }
        });
    },

    indexNarkotika: (req, res) => {
        tahanan.fetchDataNarkotika(req.db, (err, rows) => {
            if (err) {
                return res.render('admin/tahanan/index', {
                    layout: 'layout/admin/main',
                    title: 'Halaman tahanan',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    error: 'Terjadi kesalahan saat mengambil data tahanan.', // Menambahkan pesan error
                    tahanans: [] // Pastikan ini diset agar tidak undefined
                });
            } else {
                res.render('admin/tahanan/indexNarkotika', {
                    layout: 'layout/admin/main',
                    title: 'Halaman tahanan',
                    tahanans: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                });
            }
        });
    },
    
    indexOharda: (req, res) => {
        tahanan.fetchDataOharda(req.db, (err, rows) => {
            if (err) {
                return res.render('admin/tahanan/index', {
                    layout: 'layout/admin/main',
                    title: 'Halaman tahanan',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    error: 'Terjadi kesalahan saat mengambil data tahanan.', // Menambahkan pesan error
                    tahanans: [] // Pastikan ini diset agar tidak undefined
                });
            } else {
                res.render('admin/tahanan/indexOharda', {
                    layout: 'layout/admin/main',
                    title: 'Halaman tahanan',
                    tahanans: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                });
            }
        });
    },
    indexKamtibum: (req, res) => {
        tahanan.fetchDataKamtibum(req.db, (err, rows) => {
            if (err) {
                return res.render('admin/tahanan/index', {
                    layout: 'layout/admin/main',
                    title: 'Halaman tahanan',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    error: 'Terjadi kesalahan saat mengambil data tahanan.', // Menambahkan pesan error
                    tahanans: [] // Pastikan ini diset agar tidak undefined
                });
            } else {
                res.render('admin/tahanan/indexKamtibum', {
                    layout: 'layout/admin/main',
                    title: 'Halaman tahanan',
                    tahanans: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                });
            }
        });
    },

    tambah: (req, res) => {
        const userRole = req.session.user.role;

        let viewName;
        let layout;
        if (userRole === 'admin') {
            viewName = 'admin/tahanan/add_modal';
            layout = 'layout/admin/main';
        } else if (userRole === 'staff') {
            viewName = 'admin/tahanan/add_modal';
            layout = 'layout/staff/main';
        } else {
            viewName = 'public/tahanan/add_modal';
            layout = 'layout/public/main';
        }

        const provinsiQuery = 'SELECT * FROM provinsi';
        const kabupatenQuery = 'SELECT * FROM kabupaten';

        req.db.query(provinsiQuery, (err, provinsiRows) => {
            if (err) {
                req.flash('error', err.message);
                res.render(viewName, { data: '' });
                return;
            }

            req.db.query(kabupatenQuery, (err, kabupatenRows) => {
                if (err) {
                    req.flash('error', err.message);
                    res.render(viewName, { data: '' });
                } else {
                    tahanan.fetchData(req.db, (err, rows) => {
                        if (err) {
                            req.flash('error', err.message);
                            res.render(viewName, { data: '' });
                        } else {
                            res.render(viewName, {
                                layout: layout,
                                title: 'Halaman tahanan',
                                userRole: req.session.user.role,
                                user: req.session.user,
                                tahanans: rows,
                                provinsi: provinsiRows,
                                kabupaten: kabupatenRows // Kirim semua data kabupaten ke view
                            });
                        }
                    });
                }
            });
        });
    },
    detail: (req, res) => {
     tahanan.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/tahanan/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const tahanan = rows.find(tahanan => tahanan.id === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let viewName;
            let layout;
            if (userRole === 'admin') {
                viewName = 'admin/tahanan/detail_modal';
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                viewName = 'admin/tahanan/detail_modal';
                layout = 'layout/staff/main';
            } else {
                viewName = 'public/tahanan/detail_modal';
                layout = 'layout/public/main';
            }
            res.render(viewName, { 
                layout: layout,
                title: 'Halaman tahanan',
                userRole: req.session.user.role,
                user: req.session.user,
                tahanan, 
                tahanans: rows})
        }
    });
    },

//     edit: (req, res) => {
//      tahanan.fetchData(req.db, (err, rows) => {
//         if (err) {
//             req.flash('error', err.message); 
//             res.render('admin/tahanan/edit_modal', { data:''})
//         } else {
//             const id = parseInt(req.params.id);
//             const tahanan = rows.find(tahanan => tahanan.id === id);

//             const userRole = req.session.user.role; // Assuming role is stored in req.user
//             let layout;
//             if (userRole === 'admin') {
//                 layout = 'layout/admin/main';
//             } else if (userRole === 'staff') {
//                 layout = 'layout/staff/main';
//             } else {
//                 layout = 'layout/public/main';
//             }
//             res.render('admin/tahanan/edit_modal', { 
//                 layout: layout,
//                 title: 'Halaman tahanan',
//                 tahanan, 
//                 userRole: req.session.user.role,
//                 user: req.session.user,
//                 tahanans: rows})
//         }
//     });

    
// }  ,
    edit: (req, res) => {
        const userRole = req.session.user.role;

        let viewName;
        let layout;
        if (userRole === 'admin') {
            viewName = 'admin/tahanan/edit_modal';
            layout = 'layout/admin/main';
        } else if (userRole === 'staff') {
            viewName = 'admin/tahanan/edit_modal';
            layout = 'layout/staff/main';
        } else {
            viewName = 'public/tahanan/edit_modal';
            layout = 'layout/public/main';
        }

        const provinsiQuery = 'SELECT * FROM provinsi';
        const kabupatenQuery = 'SELECT * FROM kabupaten';

        req.db.query(provinsiQuery, (err, provinsiRows) => {
            if (err) {
                req.flash('error', err.message);
                res.render(viewName, { data: '' });
                return;
            }

            req.db.query(kabupatenQuery, (err, kabupatenRows) => {
                if (err) {
                    req.flash('error', err.message);
                    res.render(viewName, { data: '' });
                } else {
                    tahanan.fetchData(req.db, (err, rows) => {
                        if (err) {
                            req.flash('error', err.message);
                            res.render(viewName, { data: '' });
                        } else {
                            const id = parseInt(req.params.id);
                            const tahanan = rows.find(tahanan => tahanan.id === id);
                            res.render(viewName, {
                                layout: layout,
                                title: 'Halaman tahanan',
                                userRole: req.session.user.role,
                                user: req.session.user,
                                tahanans: rows,
                                tahanan,
                                provinsi: provinsiRows,
                                kabupaten: kabupatenRows // Kirim semua data kabupaten ke view
                            });
                        }
                    });
                }
            });
        });
    },


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

    cetakLaporanTahanan: async (req, res) => {

    function formatIndonesianDate(date) {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    const reportDir = path.join(__dirname, '../public/reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const outputPath = path.join(reportDir, 'laporan_tahanan.pdf');
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
        .text('LAPORAN DATA TAHANAN', 360, 160)
        .moveDown();


    try {
        const result = await query('SELECT * FROM tahanan');
        console.log('Query result:', result);
        const tahanans = result;

        if (!Array.isArray(tahanans)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [26, 70, 154,60,120, 55,60,60,70,]; // Lebar setiap kolom
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0) + 60; // Total lebar tabel
        const lastKolomx = 800; // posisi x akhir kolom Pangkat

        // Fungsi untuk menggambar garis horizontal
        function drawHorizontalLine(y) {
            doc.moveTo(60, y)
                .lineTo(lastKolomx, y, y)
                .stroke();
        }

        // Fungsi untuk menggambar garis vertikal
        function drawVerticalLine(x) {
            doc.moveTo(x, tableTop - 10)
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (tahanans.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Registrasi', 100, tableTop)
                .text('Nama Pembesuk', 210, tableTop)
                .text('Jenis Kelamin', 320, tableTop)
                .text('Perkara', 400, tableTop)
                .text('Provinsi', 500, tableTop)
                .text('Kebupaten', 563, tableTop)
                .text('Kecamatan', 620, tableTop)
                .text('Kelurahan', 720, tableTop);

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
            tahanans.forEach((tahanan, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(tahanan.registrasi_tahanan, 90,y)
                    .text(tahanan.nama_tahanan, 160,y)
                    .text(tahanan.jns_kelamin, 330,y)
                    .text(tahanan.perkara, 376,y)
                    .text(tahanan.provinsi, 494,y)
                    .text(tahanan.kabupaten, 550,y)
                    .text(tahanan.kecamatan, 610,y)
                    .text(tahanan.kelurahan, 670,y);

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

  cetakLaporanTahananNarkotika: async (req, res) => {

    function formatIndonesianDate(date) {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    const reportDir = path.join(__dirname, '../public/reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const outputPath = path.join(reportDir, 'laporan_tahanan.pdf');
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
        .text('LAPORAN DATA TAHANAN PERKARA NARKOTIKA', 360, 160)
        .moveDown();

    try {
        const result = await query("SELECT * FROM tahanan WHERE perkara = 'Narkotika / Enz.2'");
        console.log('Query result:', result);
        const tahanans = result;

        if (!Array.isArray(tahanans)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [26, 70, 154,60,120, 55,60,60,70,]; // Lebar setiap kolom
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0) + 60; // Total lebar tabel
        const lastKolomx = 800; // posisi x akhir kolom Pangkat

        // Fungsi untuk menggambar garis horizontal
        function drawHorizontalLine(y) {
            doc.moveTo(60, y)
                .lineTo(lastKolomx, y, y)
                .stroke();
        }

        // Fungsi untuk menggambar garis vertikal
        function drawVerticalLine(x) {
            doc.moveTo(x, tableTop - 10)
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (tahanans.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Registrasi', 100, tableTop)
                .text('Nama Pembesuk', 210, tableTop)
                .text('Jenis Kelamin', 320, tableTop)
                .text('Perkara', 400, tableTop)
                .text('Provinsi', 500, tableTop)
                .text('Kebupaten', 563, tableTop)
                .text('Kecamatan', 620, tableTop)
                .text('Kelurahan', 720, tableTop);

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
            tahanans.forEach((tahanan, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(tahanan.registrasi_tahanan, 90,y)
                    .text(tahanan.nama_tahanan, 160,y)
                    .text(tahanan.jns_kelamin, 330,y)
                    .text(tahanan.perkara, 376,y)
                    .text(tahanan.provinsi, 494,y)
                    .text(tahanan.kabupaten, 550,y)
                    .text(tahanan.kecamatan, 610,y)
                    .text(tahanan.kelurahan, 670,y);

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

  cetakLaporanTahananOharda: async (req, res) => {

    function formatIndonesianDate(date) {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    const reportDir = path.join(__dirname, '../public/reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const outputPath = path.join(reportDir, 'laporan_tahanan.pdf');
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
        .text('LAPORAN DATA TAHANAN PERKARA ORANG DAN HARTA BENDA', 260, 160)
        .moveDown();

    try {
        const result = await query("SELECT * FROM tahanan WHERE perkara = 'Orang dan Harta Benda / Eoh.2'");
        console.log('Query result:', result);
        const tahanans = result;

        if (!Array.isArray(tahanans)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [26, 70, 154,60,120, 55,60,60,70,]; // Lebar setiap kolom
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0) + 60; // Total lebar tabel
        const lastKolomx = 800; // posisi x akhir kolom Pangkat

        // Fungsi untuk menggambar garis horizontal
        function drawHorizontalLine(y) {
            doc.moveTo(60, y)
                .lineTo(lastKolomx, y, y)
                .stroke();
        }

        // Fungsi untuk menggambar garis vertikal
        function drawVerticalLine(x) {
            doc.moveTo(x, tableTop - 10)
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (tahanans.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Registrasi', 100, tableTop)
                .text('Nama Pembesuk', 210, tableTop)
                .text('Jenis Kelamin', 320, tableTop)
                .text('Perkara', 400, tableTop)
                .text('Provinsi', 500, tableTop)
                .text('Kebupaten', 563, tableTop)
                .text('Kecamatan', 620, tableTop)
                .text('Kelurahan', 720, tableTop);

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
            tahanans.forEach((tahanan, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(tahanan.registrasi_tahanan, 90,y)
                    .text(tahanan.nama_tahanan, 160,y)
                    .text(tahanan.jns_kelamin, 330,y)
                    .text(tahanan.perkara, 376,y)
                    .text(tahanan.provinsi, 494,y)
                    .text(tahanan.kabupaten, 550,y)
                    .text(tahanan.kecamatan, 610,y)
                    .text(tahanan.kelurahan, 670,y);

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

cetakLaporanTahananKamtibum: async (req, res) => {

    function formatIndonesianDate(date) {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    const reportDir = path.join(__dirname, '../public/reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const outputPath = path.join(reportDir, 'laporan_tahanan.pdf');
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
        .text('LAPORAN DATA TAHANAN PERKARA KEAMANAN DAN KETERTIBAN UMUM', 220, 160)
        .moveDown();

    try {
        const result = await query("SELECT * FROM tahanan WHERE perkara = 'Keamanan dan Ketertiban Umum / Eku.2'");
        console.log('Query result:', result);
        const tahanans = result;

        if (!Array.isArray(tahanans)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [26, 70, 154,60,120, 55,60,60,70,]; // Lebar setiap kolom
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0) + 60; // Total lebar tabel
        const lastKolomx = 800; // posisi x akhir kolom Pangkat

        // Fungsi untuk menggambar garis horizontal
        function drawHorizontalLine(y) {
            doc.moveTo(60, y)
                .lineTo(lastKolomx, y, y)
                .stroke();
        }

        // Fungsi untuk menggambar garis vertikal
        function drawVerticalLine(x) {
            doc.moveTo(x, tableTop - 10)
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (tahanans.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Registrasi', 100, tableTop)
                .text('Nama Pembesuk', 210, tableTop)
                .text('Jenis Kelamin', 320, tableTop)
                .text('Perkara', 400, tableTop)
                .text('Provinsi', 500, tableTop)
                .text('Kebupaten', 563, tableTop)
                .text('Kecamatan', 620, tableTop)
                .text('Kelurahan', 720, tableTop);

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
            tahanans.forEach((tahanan, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(tahanan.registrasi_tahanan, 90,y)
                    .text(tahanan.nama_tahanan, 160,y)
                    .text(tahanan.jns_kelamin, 330,y)
                    .text(tahanan.perkara, 376,y)
                    .text(tahanan.provinsi, 494,y)
                    .text(tahanan.kabupaten, 550,y)
                    .text(tahanan.kecamatan, 610,y)
                    .text(tahanan.kelurahan, 670,y);

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


    cetakPDFTahanan: async (req, res) => {

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

        const outputPath = path.join(reportDir, 'laporan_tahanan.pdf');
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const writeStream = fs.createWriteStream(outputPath);
        doc.pipe(writeStream);

        // Bagian header
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
            const result = await query("SELECT * FROM tahanan");
            const tahanan = result.find(tahanan => tahanan.id === id);

            if (!tahanan) {
                throw new Error('Tahanan not found');
            }

            // Fungsi untuk menggambar baris dan garis secara otomatis
            const a = 190;
            const b = 310;
            const c = 300;

            doc.text(':', c, 240)
                .text(':', c, 260)
                .text(':', c, 280)
                .text(':', c, 320)
                .text(':', c, 340)
                .text(':', c, 360)
                .text(':', c, 380)
                .text(':', c, 420)
                .text(':', c, 440)
                .text(':', c, 460)
                .text(':', c, 480)
                .text(':', c, 500)
                .text(':', c, 520)
                .text(':', c, 540);

            // Title
            doc.font('Helvetica-Bold')
                .fontSize(14)
                .text('DATA TAHANAN : ' + tahanan.registrasi_tahanan, 160, 180)
                .fontSize(10)
                .font('Helvetica')
                .text('Nama Tahanan', a, 240)
                .text('Tanggal Lahir', a, 260)
                .text('Tempat lahir', a, 280)
                .text('Alamat', a, 300)
                .fontSize(8)
                .text('Provinsi', 200, 320)
                .text('Kabupaten / Kota', 200, 340)
                .text('Kecamatan', 200, 360)
                .text('Kelurahan / Desa', 200, 380)
                .fontSize(10)
                .text('Agama', a, 420)
                .text('Jenis Kelamin', a, 440)
                .text('Pekerjaan', a, 460)
                .text('Pendidikan', a, 480)
                .text('Perkara', a, 500)
                .text('Kewarganegaraan', a, 520)
                .text('Tanggal Surat Tuntutan', a, 540);

            // Isi data
            const gambarTahanan = tahanan.gambar_tahanan;
            const gambarPath = path.join(__dirname, '../public/images/tahanan/', gambarTahanan);
            const defaultImagePath = path.join(__dirname, '../public/images/tahanan/tahanan.jpg');

            const imagePath = (fs.existsSync(gambarPath) && gambarTahanan) ? gambarPath : defaultImagePath;

            doc.image(imagePath, 60, 250, { width: 100 })
                .font('Helvetica')
                .fontSize(10);

            const tgl_lahir = formatIndonesianDate(new Date(tahanan.tgl_lahir));
            const tgl_surat_tuntutan = formatIndonesianDate(new Date(tahanan.tgl_surat_tuntutan));

            doc.text(tahanan.nama_tahanan, b, 240)
                .text(tgl_lahir, b, 260)
                .text(tahanan.tmp_lahir, b, 280)
                .text(tahanan.alamat, b, 300)
                .text(tahanan.provinsi, b, 320)
                .text(tahanan.kabupaten, b, 340)
                .text(tahanan.kecamatan, b, 360)
                .text(tahanan.kelurahan, b, 380)
                .text(tahanan.agama, b, 420)
                .text(tahanan.jns_kelamin, b, 440)
                .text(tahanan.pekerjaan, b, 460)
                .text(tahanan.pendidikan, b, 480)
                .text(tahanan.perkara, b, 500)
                .text(tahanan.kewarganegaraan, b, 520)
                .text(tgl_surat_tuntutan, b, 540);

            // Footer tabel
            const currentDate = new Date();
            const formattedDate = formatIndonesianDate(currentDate);

            doc.fontSize(8)
                .text(`Banjarmasin, ${formattedDate}`, 344, 660)
                .text('An. KEPALA KEJAKSAAN NEGERI BANJARMASIN', 320, 674)
                .text('An. KEPALA SEKSI TINDAK PIDANA UMUM', 330, 688)
                .text('HABIBI, S.H', 390, 760)
                .text('JAKSA MUDA Nip. 19820302 200912 1 003', 330, 774);

            const ttdPath = path.join(__dirname, '../public/images/ttd.png');
            doc.image(ttdPath, 340, 700, { width: 140 });

            doc.end();

        } catch (err) {
            console.error('Error fetching jaksa data:', err);
            res.status(500).send('Error generating PDF');
        }

        writeStream.on('finish', () => {
            try {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename="laporan_tahanan.pdf"');

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
        const worksheet = workbook.addWorksheet('tahanan');

        // Menambahkan header
        worksheet.columns = [
            { header: 'NO', key: 'NO', width: 20 },
            { header: 'Nama Tahanan', key: 'nama_tahanan', width: 20 },
            { header: 'Registrasi Tahanan', key: 'registrasi_tahanan', width: 30, style: { numFmt: '@' }},
            { header: 'Tanggal Lahir', key: 'tgl_lahir', width: 20 },
            { header: 'Tempat Lahir', key: 'tmp_lahir', width: 20 },
            { header: 'Provinsi', key: 'provinsi', width: 20 },
            { header: 'Kabupaten / Kota', key: 'kabupaten', width: 20 },
            { header: 'Kecamatan', key: 'kecamatan', width: 20 },
            { header: 'Kelurahan / Desa', key: 'kelurahan', width: 20 },
            { header: 'Agama', key: 'agama', width: 20 },
            { header: 'Jenis Kelamin', key: 'jns_kelamin', width: 20 },
            { header: 'Pekerjaan', key: 'pekerjaan', width: 20 },
            { header: 'Pendidikan', key: 'pendidikan', width: 20 },
            { header: 'Perkara', key: 'perkara', width: 20 },
            { header: 'kewarganegaraan', key: 'kewarganegaraan', width: 20 },
            { header: 'Tanggal Surat Tuntutan', key: 'tgl_surat_tuntutan', width: 20 },
        ];

        // Ambil data dari database
        const result = await pool.query("SELECT * FROM tahanan");
        const tahananData = result[0]; // Mengambil data dari hasil query

        // Menambahkan baris ke worksheet
        tahananData.forEach((tahanan,i) => {
            worksheet.addRow({
                NO: i+1,
                nama_tahanan: tahanan.nama_tahanan,
                registrasi_tahanan: tahanan.registrasi_tahanan,
                tgl_lahir: tahanan.tgl_lahir,
                tmp_lahir: tahanan.tmp_lahir,
                provinsi: tahanan.provinsi,
                kabupaten: tahanan.kabupaten,
                kecamatan: tahanan.kecamatan,
                kelurahan: tahanan.kelurahan,
                agama: tahanan.agama,
                jns_kelamin: tahanan.jns_kelamin,
                pekerjaan: tahanan.pekerjaan,
                pendidikan: tahanan.pendidikan,
                perkara: tahanan.perkara,
                kewarganegaraan: tahanan.kewarganegaraan,
                tgl_surat_tuntutan: tahanan.tgl_surat_tuntutan,
            });
        });

        // Set header untuk unduhan
        res.setHeader('Content-Disposition', 'attachment; filename=tahanan_report.xlsx');
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
            // Query untuk mengambil data dari tabel tahanan
            const result = await pool.query("SELECT * FROM tahanan");
            const tahananData = result[0]; // Mengambil data dari hasil query

            // Definisikan fields untuk CSV
            const fields = [
                { label: 'Nama Tahanan', value: 'nama_tahanan' },
                { label: 'Registrasi Tahanan', value: 'registrasi_tahanan' },
                { label: 'Tanggal Lahir', value: 'tgl_lahir' },
                { label: 'Tempat Lahir', value: 'tmp_lahir' },
                { label: 'Provinsi', value: 'provinsi' },
                { label: 'Kabupaten / Kota', value: 'kabupaten' },
                { label: 'Kecamatan', value: 'kecamatan' },
                { label: 'Kelurahan', value: 'kelurahan' },
                { label: 'Agama', value: 'agama' },
                { label: 'Jenis Kelamin', value: 'jns_kelamin' },
                { label: 'Pekerjaan', value: 'pekerjaan' },
                { label: 'pendidikan', value: 'pendidikan' },
                { label: 'Perkara', value: 'perkara' },
                { label: 'Kewarganegaraan', value: 'kewarganegaraan' },
                { label: 'Tanggal Surat Tuntutan', value: 'tgl_surat_tuntutan' },


                // Tambahkan fields lain sesuai dengan kolom di tabel tahanan
            ];

            // Konversi data ke CSV
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(tahananData);

            // Set header untuk unduhan
            res.header('Content-Type', 'text/csv');
            res.attachment('tahanan_report.csv');
            res.send(csv);
        } catch (error) {
            console.error('Error generating CSV report:', error);
            res.status(500).send('Error generating CSV report');
        }
    },  
}