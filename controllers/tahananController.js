const tahanan = require('../models/tahananModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
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
}