const jaksa = require('../models/jaksaModel');
const excel = require('exceljs');
const pool = require('../database/pool.js');
const createPDFReport = require('../utils/pdfHelper');
const db = require('../database/conn.js'); // Import konfigurasi database
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


cetakLaporanJaksa: async (req, res) => {

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

    doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('LAPORAN DATA JAKSA', 260, 160)
        .moveDown();

        // bagian isi tabel

    try {
        const result = await query('SELECT * FROM jaksa');
        console.log('Query result:', result);
        const jaksas = result;

        if (!Array.isArray(jaksas)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const columnWidths = [50, 150, 150, 150]; // Lebar setiap kolom
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0) + 60; // Total lebar tabel
        const pangkatColumnEndX = 570; // posisi x akhir kolom Pangkat

        // Fungsi untuk menggambar garis horizontal
        function drawHorizontalLine(y) {
            doc.moveTo(60, y)
                .lineTo(pangkatColumnEndX, y, y)
                .stroke();
        }

        // Fungsi untuk menggambar garis vertikal
        function drawVerticalLine(x) {
            doc.moveTo(x, tableTop - 10)
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (jaksas.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(10) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Nama', 120, tableTop)
                .text('NIP', 270, tableTop)
                .text('Pangkat', 420, tableTop);

            drawHorizontalLine(tableTop + 15); // Garis bawah header
            drawHorizontalLine(tableTop + -10); // Garis bawah header

            // Garis vertikal kolom
            let x = 60;
            columnWidths.forEach((width) => {
                drawVerticalLine(x);
                x += width;
            });
            // Garis vertikal penutup di samping kolom Pangkat
            drawVerticalLine(pangkatColumnEndX);
            // Data tabel
            doc.font('Helvetica')
                .fontSize(8); // Ukuran font data tabel
            jaksas.forEach((jaksa, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(jaksa.nama, 120, y)
                    .text(jaksa.nip, 270, y)
                    .text(jaksa.pangkat, 420, y);

                drawHorizontalLine(y + 14); // Garis bawah setiap baris data
            });
        }

        // Panggil fungsi untuk menggambar tabel
        drawTable();


        // footer tabel
        
        const currentDate = new Date();
        const formattedDate = formatIndonesianDate(currentDate);
        doc.fontSize(8)
             .text(`Banjarmasin, ${formattedDate}`, 360, 660 );
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

downloadExcel : async (req, res) => {
    try {
        // Buat workbook dan sheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Jaksa');

        // Menambahkan header
        worksheet.columns = [
            { header: 'NIP', key: 'nip', width: 20 },
            { header: 'Nama', key: 'nama', width: 30 },
            { header: 'Pangkat', key: 'pangkat', width: 20 }
        ];

        // Ambil data dari database
        const result = await pool.query('SELECT * FROM jaksa');
        const jaksaData = result[0]; // Mengambil data dari hasil query

        // Menambahkan baris ke worksheet
        jaksaData.forEach(jaksa => {
            worksheet.addRow({
                nip: jaksa.nip,
                nama: jaksa.nama,
                pangkat: jaksa.pangkat
            });
        });

        // Set header untuk unduhan
        res.setHeader('Content-Disposition', 'attachment; filename=jaksa_report.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Kirim file Excel sebagai respons
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel report:', error);
        res.status(500).send('Error generating Excel report');
    }
},
}
