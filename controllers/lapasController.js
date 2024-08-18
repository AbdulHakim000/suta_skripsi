const lapas = require('../models/lapasModel');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

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

    cetakPDF: async (req, res) => {

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

    const outputPath = path.join(reportDir, 'laporan_lapas.pdf');
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
        .text('LAPORAN DATA LAPAS', 260, 160)
        .moveDown();

        // bagian isi tabel

    try {
        const result = await query('SELECT * FROM lapas');
        console.log('Query result:', result);
        const lapass = result;

        if (!Array.isArray(lapass)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const columnWidths = [30, 130, 350]; // Lebar setiap kolom
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
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (lapass.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(10) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Nama Lapas', 120, tableTop)
                .text('Alamat Lapas', 370, tableTop)

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
            lapass.forEach((lapas, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(lapas.nama_lapas,94, y)
                    .text(lapas.alamat, 230, y)
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
            res.setHeader('Content-Disposition', 'inline; filename="laporan_lapas.pdf"');

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