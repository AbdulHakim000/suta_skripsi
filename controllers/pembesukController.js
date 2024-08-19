const pembesuk = require('../models/pembesukModel');
const PDFDocument = require('pdfkit');
const excel = require('exceljs');
const pool = require('../database/pool.js');
const { Parser } = require('json2csv');
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
module.exports = {
    index: (req, res) => {

    const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pembesuk/index', { data:''})
        } else {
            res.render('admin/pembesuk/index', { 
                layout: layout,
                userRole: req.session.user.role,
                user: req.session.user,
                title: 'Halaman Pembesuk',
                pembesuks: rows})
        }
    });
    },
    tambah: (req, res) => {

    const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pembesuk/add_modal', { data:''})
        } else {
            res.render('admin/pembesuk/add_modal', { 
                layout: layout,
                userRole: req.session.user.role,
                user: req.session.user,
                title: 'Halaman Pembesuk',
                pembesuks: rows})
        }
    });
    },

    detail: (req, res) => {
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pembesuk/detail_modal', { data:''})
        } else {
            const nik = parseInt(req.params.nik);
            const pembesuk = rows.find(pembesuk => pembesuk.nik === nik);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('admin/pembesuk/detail_modal', { 
                layout: layout,
                title: 'Halaman Pembesuk',
                userRole: req.session.user.role,
                user: req.session.user,
                pembesuk, 
                pembesuks: rows})
        }
    });
    },

    edit: (req, res) => {
     pembesuk.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pembesuk/edit_modal', { data:''})
        } else {
            const nik = parseInt(req.params.nik);
            const pembesuk = rows.find(pembesuk => pembesuk.nik === nik);
            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('admin/pembesuk/edit_modal', { 
                layout: layout,
                title: 'Halaman Pembesuk',
                userRole: req.session.user.role,
                user: req.session.user,
                pembesuk, 
                pembesuks: rows})
        }
    });

    
}  ,



add: async(req, res) => {
    const {nik, nama, tmp_lahir, jns_kelamin, pekerjaan, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan} = req.body;
    const form_pembesuk = {
        nik,
        nama_pembesuk : nama,
        tmp_lahir,
        jns_kelamin,
        pekerjaan,
        provinsi,
        kabupaten,
        kecamatan,
        kelurahan,
        kewarganegaraan,
    }
        // Validasi nik
    if (!/^\d{16,}$/.test(nik)) {
        req.session.message = {
            type: 'error',
            text: 'NIk harus terdiri dari minimal 16 digit angka.'
        };
        return res.redirect('/pembesuk');
    }

    try {

        console.log(form_pembesuk);
        // Menyimpan data ke database
        await pembesuk.insertData(req.db, form_pembesuk);

        req.session.message = {
            type: 'success',
            text: 'Data berhasil dimasukkan ke database'
        };
        res.redirect('/pembesuk');
    
    } catch (err) {
        console.error('Error detail:', err);
        req.session.message = {
            type: 'error',
            text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
        };
        res.redirect('/pembesuk');
    }
},
    
    
// update: (req, res) => {
//     const {nik, nama_pembesuk, tmp_lahir, jns_kelamin, pekerjaan, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan} = req.body;
//     const form_pembesuk = {
//             nik,
//             nama_pembesuk,
//             tmp_lahir,
//             jns_kelamin,
//             pekerjaan,
//             provinsi,
//             kabupaten,
//             kecamatan,
//             kelurahan,
//             kewarganegaraan,
//         }
    
//     console.log(form_pembesuk);
//     pembesuk.updateData(req.db, nik, form_pembesuk, (err, result) => {
//             if (err) {
//                 req.flash('error','Error Ketika Memasukkan Data', err.message);
//                 res.redirect('/pembesuk');
//             } else {
//                 req.flash('succes','Data Berhasil diUpdate');
//                 res.redirect('/pembesuk');
//             }
//         })
//     },

 update: async (req, res) => {
    const {nik, nama_pembesuk, tmp_lahir, jns_kelamin, pekerjaan, provinsi, kabupaten, kecamatan, kelurahan, kewarganegaraan} = req.body;
    const form_pembesuk = {
            nik,
            nama_pembesuk,
            tmp_lahir,
            jns_kelamin,
            pekerjaan,
            provinsi,
            kabupaten,
            kecamatan,
            kelurahan,
            kewarganegaraan,
        }
    

    console.log(form_pembesuk);

    try {
        // Mengupdate data dengan menggunakan async/await
        await pembesuk.updateData(req.db, nik, form_pembesuk);
        
        req.session.message = {
            type: 'success',
            text: 'Data berhasil terUpdate'
        };
        res.redirect('/pembesuk');
    } catch (err) {
        console.error('Error detail:', err);
        req.session.message = {
            type: 'error',
            text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
        };
        res.redirect('/pembesuk');
    }
},

    delete : (req, res) => {
        const nik = parseInt(req.params.nik); // Mengambil nik dari parameter URL
        console.log(nik);
        pembesuk.deleteData(req.db, nik, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/pembesuk');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/pembesuk');
        }
    })
    },

cetakLaporanPembesuk: async (req, res) => {

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

    const outputPath = path.join(reportDir, 'laporan_pembesuk.pdf');
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
        .text('LAPORAN DATA PEMBESUK', 360, 160)
        .moveDown();


    try {
        const result = await query('SELECT * FROM pembesuk');
        console.log('Query result:', result);
        const pembesuks = result;

        if (!Array.isArray(pembesuks)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [30, 130, 110,60,100, 75,60,60,70,]; // Lebar setiap kolom
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
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (pembesuks.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('NIK', 100, tableTop)
                .text('Nama Pembesuk', 230, tableTop)
                .text('Jenis Kelamin', 340, tableTop)
                .text('Pekerjaan', 400, tableTop)
                .text('Provinsi', 500, tableTop)
                .text('Kebupaten', 570, tableTop)
                .text('Kecamatan', 630, tableTop)
                .text('Kelurahan', 700, tableTop);

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
                .fontSize(6); // Ukuran font data tabel
            pembesuks.forEach((pembesuk, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(pembesuk.nik, 100,y)
                    .text(pembesuk.nama_pembesuk, 230,y)
                    .text(pembesuk.jns_kelamin, 340,y)
                    .text(pembesuk.pekerjaan, 400,y)
                    .text(pembesuk.provinsi, 500,y)
                    .text(pembesuk.kabupaten, 570,y)
                    .text(pembesuk.kecamatan, 630,y)
                    .text(pembesuk.kelurahan, 700,y);

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

    downloadExcel : async (req, res) => {
    try {
        // Buat workbook dan sheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Pembesuk');

        // Menambahkan header
        worksheet.columns = [
            { header: 'NO', key: 'NO', width: 20 },
            { header: 'Nama Pembesuk', key: 'nama_pembesuk', width: 30},
            { header: 'NIK', key: 'nik', width: 20, style: { numFmt: '@' } },
            { header: 'Tempat Lahir', key: 'tmp_lahir', width: 20 },
            { header: 'Provinsi', key: 'provinsi', width: 20 },
            { header: 'Kabupaten / Kota', key: 'kabupaten', width: 20 },
            { header: 'Kecamatan', key: 'kecamatan', width: 20 },
            { header: 'Kelurahan / Desa', key: 'kelurahan', width: 20 },
            { header: 'Jenis Kelamin', key: 'jns_kelamin', width: 20 },
            { header: 'Pekerjaan', key: 'pekerjaan', width: 20 },
            { header: 'Kewarganegaraan', key: 'kewarganegaraan', width: 20 },
        ];

        // Ambil data dari database
        const result = await pool.query("SELECT * FROM pembesuk");
        const pembesukData = result[0]; // Mengambil data dari hasil query

        // Menambahkan baris ke worksheet
        pembesukData.forEach((pembesuk,i) => {
            worksheet.addRow({
                NO: i+1,
                nama_pembesuk: pembesuk.nama_pembesuk, // Pastikan nik dikonversi ke string
                nik: pembesuk.nik.toString(),
                tmp_lahir: pembesuk.tmp_lahir,
                provinsi: pembesuk.provinsi,
                kabupaten: pembesuk.kabupaten,
                kecamatan: pembesuk.kecamatan,
                kelurahan: pembesuk.kelurahan,
                jns_kelamin: pembesuk.jns_kelamin,
                pekerjaan: pembesuk.pekerjaan,
                kewarganegaraan: pembesuk.kewarganegaraan,
            });
        });

        // Set header untuk unduhan
        res.setHeader('Content-Disposition', 'attachment; filename=pembesuk_report.xlsx');
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
            // Query untuk mengambil data dari tabel pembesuk
            const result = await pool.query("SELECT * FROM pembesuk");
            const pembesukData = result[0]; // Mengambil data dari hasil query

            // Definisikan fields untuk CSV
            const fields = [
                { label: 'Nama pembesuk', value: 'nama_pembesuk' },
                { label: 'NIK', value: 'nik' },
                { label: 'Tempat Lahir', value: 'tmp_lahir' },
                { label: 'Provinsi', value: 'provinsi' },
                { label: 'Kabupaten / Kota', value: 'kabupaten' },
                { label: 'Kecamatan', value: 'kecamatan' },
                { label: 'Kelurahan / Desa', value: 'kelurahan' },
                { label: 'Jenis Kelamin', value: 'jns_kelamin' },
                { label: 'Pekerjaan', value: 'pekerjaan' },
                { label: 'Kewarganegaraan', value: 'kewarganegaraan' },

                // Tambahkan fields lain sesuai dengan kolom di tabel pembesuk
            ];

            // Konversi data ke CSV
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(pembesukData);

            // Set header untuk unduhan
            res.header('Content-Type', 'text/csv');
            res.attachment('pembesuk_report.csv');
            res.send(csv);
        } catch (error) {
            console.error('Error generating CSV report:', error);
            res.status(500).send('Error generating CSV report');
        }
    },  
}