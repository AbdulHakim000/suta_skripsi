const surat = require('../models/suratModel');
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

module.exports = {

    index: (req, res) => {
        // Ambil data surat
        surat.fetchDataWithTahanan(req.db, (errSurat, rowsSurat) => {
            if (errSurat) {
                req.flash('error', errSurat.message);
                return res.render('admin/surat/index', { surats: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            surat.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/surat/index', { surats: rowsSurat, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                surat.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('admin/surat/index', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: [] });
                    }

                    surat.fetchJoinedData(req.db, (errJoin, rowsJoin) => {
                        if (errJoin) {
                        req.flash('error', errJoin.message);
                        return res.render('admin/surat/index', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: rowsPembesuks, join: [] });
                    }

                    const user = req.user; // Pastikan user sudah didefinisikan
                    // Render view dengan ketiga data
                    const userRole = req.session.user.role; // Assuming role is stored in req.user

                        let layout;
                        if (userRole === 'admin') {
                            layout = 'layout/admin/main';
                        } else if (userRole === 'staff') {
                            layout = 'layout/staff/main';
                        } else {
                            layout = 'layout/public/main';
        }
                        res.render('admin/surat/index', {
                            layout: layout,
                            title: 'Halaman Surat',
                            user: req.session.user,
                            userRole: req.session.user.role,
                            surats: rowsSurat,
                            tahanans: rowsTahanan,
                            pembesuks: rowsPembesuk,
                            joins: rowsJoin
                        });
                    });
                });
            });
        });
    },
    tambah: (req, res) => {
        // Ambil data surat
        surat.fetchDataWithTahanan(req.db, (errSurat, rowsSurat) => {
            if (errSurat) {
                req.flash('error', errSurat.message);
                return res.render('admin/surat/add_modal', { surats: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            surat.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/surat/add_modal', { surats: rowsSurat, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                surat.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('admin/surat/add_modal', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: [] });
                    }

                    surat.fetchJoinedData(req.db, (errJoin, rowsJoin) => {
                        if (errJoin) {
                        req.flash('error', errJoin.message);
                        return res.render('admin/surat/add_modal', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: rowsPembesuks, join: [] });
                    }

                    const user = req.user; // Pastikan user sudah didefinisikan
                    // Render view dengan ketiga data
                    const userRole = req.session.user.role; // Assuming role is stored in req.user

                        let layout;
                        if (userRole === 'admin') {
                            layout = 'layout/admin/main';
                        } else if (userRole === 'staff') {
                            layout = 'layout/staff/main';
                        } else {
                            layout = 'layout/public/main';
        }
                        res.render('admin/surat/add_modal', {
                            layout: layout,
                            title: 'Halaman Surat',
                            user: req.session.user,
                            userRole: req.session.user.role,
                            surats: rowsSurat,
                            tahanans: rowsTahanan,
                            pembesuks: rowsPembesuk,
                            joins: rowsJoin
                        });
                    });
                });
            });
        });
    },



    detail: (req, res) => {
     surat.fetchJoinedData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/surat/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const surat = rows.find(surat => surat.id_surat === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('admin/surat/detail_modal', { 
                layout: layout,
                title: 'Halaman Surat',
                surat, 
                user: req.session.user,
                surats: rows})
        }
    });
    },


    // Ambil data surat
    edit: (req, res) => {
       surat.fetchData(req.db, (errSurat, rowsSurat) => {
            if (errSurat) {
                req.flash('error', errSurat.message);
                return res.render('admin/surat/edit_modal', { surats: [], tahanans: [], pembesuks: [] });
            }

            // Ambil data tahanan
            surat.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/surat/edit_modal', { surats: rowsSurat, tahanans: [], pembesuks: [] });
                }

                // Ambil data pembesuk
                surat.fetchDataPembesuk(req.db, (errPembesuk, rowsPembesuk) => {
                    if (errPembesuk) {
                        req.flash('error', errPembesuk.message);
                        return res.render('admin/surat/edit_modal', { surats: rowsSurat, tahanans: rowsTahanan, pembesuks: [] });
                    }
                    const id = parseInt(req.params.id);
                    const surat = rowsSurat.find(surat => surat.id_surat === id);

                    const userRole = req.session.user.role; // Assuming role is stored in req.user
                    let layout;
                    if (userRole === 'admin') {
                        layout = 'layout/admin/main';
                    } else if (userRole === 'staff') {
                        layout = 'layout/staff/main';
                    } else {
                        layout = 'layout/public/main';
                    }
                    // Render view dengan ketiga data
                    res.render('admin/surat/edit_modal', {
                        layout: layout,
                        title: 'Halaman Surat',
                        surat,
                        surats: rowsSurat,
                        user: req.session.user,
                        userRole: req.session.user.role,
                        tahanans: rowsTahanan,
                        pembesuks: rowsPembesuk
                    });
                });
            });
        });
    },

    add: async  (req, res) =>{
         const {nik, registrasi_tahanan, hubungan, tanggal1, tanggal2, pembuatan} = req.body;
        const form_surat = {
            nik,
            registrasi_tahanan,
            hubungan,
            tanggal1,
            tanggal2,
            pembuatan,
        }

        try {
            console.log('form_surat')
            // menyimpan data ke database
            await surat.insertData(req.db, form_surat);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/surat');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/surat');
        }
    },
    
    
    update: async (req, res) => {
        const {id_surat, nik, registrasi_tahanan, hubungan, tanggal1, tanggal2, pembuatan} = req.body;
        const form_surat = {
            id_surat,
            nik,
            registrasi_tahanan,
            hubungan,
            tanggal1,
            tanggal2,
            pembuatan,
        }

        console.log(form_surat);

        try {
            // Mengupdate data dengan menggunakan async/await
            await surat.updateData(req.db, id_surat, form_surat);
            
            req.session.message = {
                type: 'success',
                text: 'Data berhasil terUpdate'
            };
            res.redirect('/surat');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
            };
            res.redirect('/surat');
        }
    },

    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        surat.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/surat');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/surat');
        }
    })
    },

    cetakPDF: async (req, res) => {

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

    const outputPath = path.join(reportDir, 'laporan_surat.pdf');
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
        .text('LAPORAN DATA SURAT IZIN BESUK', 330, 160)
        .moveDown();


    try {
        const result = await query("SELECT surat.*, tahanan.nama_tahanan,  pembesuk.nama_pembesuk FROM surat INNER JOIN tahanan ON surat.registrasi_tahanan = tahanan.registrasi_tahanan INNER JOIN pembesuk ON surat.nik = pembesuk.nik");
        console.log('Query result:', result);
        const surats = result;

        if (!Array.isArray(surats)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [30, 70, 110,100,200, 75,75,80,]; // Lebar setiap kolom
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
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (surats.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('NIK', 100, tableTop)
                .text('Nama Pembesuk', 180, tableTop)
                .text('Registrasi Tahanan', 290, tableTop)
                .text('Nama Tahanan', 400, tableTop)
                .text('Hubungan', 594, tableTop)
                .text('Tanggal Besuk 1', 660, tableTop)
                .text('Tanggal Besuk 2', 730, tableTop)

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
            surats.forEach((surat, i) => {
                const y = tableTop + (i + 1) * rowSpacing;
                const tgl1 = formatIndonesianDate(new Date(surat.tanggal1));
                const tgl2 = formatIndonesianDate(new Date(surat.tanggal2));

                doc.text(i + 1, 70, y)
                    .text(surat.nik, 100,y)
                    .text(surat.nama_pembesuk, 164,y)
                    .text(surat.registrasi_tahanan, 290,y)
                    .text(surat.nama_tahanan, 374,y)
                    .text(surat.hubungan, 575,y)
                    .text(tgl1, 648,y)
                    .text(tgl2, 724,y)
                drawHorizontalLine(y + 14); // Garis bawah setiap baris data
            });
        }

        // Panggil fungsi untuk menggambar tabel
        drawTable();


        // footer tabel
        
        const currentDate = new Date();
        const formattedDate = formatIndonesianDate(currentDate);
        doc.fontSize(8)
             .text(`Banjarmasin, ${formattedDate}`, 540, 420 );
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
        const result = await query("SELECT surat.*, tahanan.nama_tahanan, tahanan.tmp_lahir, tahanan.tgl_lahir, tahanan.jns_kelamin, tahanan.pekerjaan AS pekerjaan_tahanan, tahanan.perkara, pembesuk.nama_pembesuk, pembesuk.provinsi, pembesuk.kabupaten, pembesuk.kecamatan, pembesuk.kelurahan, pembesuk.pekerjaan AS pekerjaan_pembesuk FROM surat INNER JOIN tahanan ON surat.registrasi_tahanan = tahanan.registrasi_tahanan INNER JOIN pembesuk ON surat.nik = pembesuk.nik");
        console.log('Query result:', result);
        const surat = result.find(s => s.id_surat === id);

    

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
            doc.text(':', c, 580)

            // title
            doc.font('Helvetica-Bold')
                .fontSize(14)
                .text('SURAT IZIN MENGUNJUNGI TAHANAN',180, 150)

                .text('NOMOR: 0.3.10/                                                                         /2024',100, 170)
                .text(surat.perkara,210, 170)
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
                .text('Tanggal Besuk Kedua', a, 580);

            // isi data

            const tanggal1 = formatIndonesianDate(surat.tanggal1);
            const tanggal2 = formatIndonesianDate(surat.tanggal2);
            doc.font('Helvetica')
                .fontSize(10); // Ukuran font data tabel
                doc.text(surat.nama_pembesuk, b, 230)
                    .text(surat.kelurahan, b, 250)
                    .text(surat.kecamatan, b, 270)
                    .text(surat.kabupaten, b, 290)
                    .text(surat.provinsi, b, 310)
                    .text(surat.pekerjaan_pembesuk, b, 330)
                    .text(surat.hubungan, b, 350)

                    .text(surat.nama_tahanan, b, 420)
                    .text(surat.tmp_lahir, b, 440)
                    .text(surat.jns_kelamin, b, 460)
                    .text(surat.pekerjaan_tahanan, b, 480)
                    .text(surat.registrasi_tahanan, b, 500)
                    .text('Bertamu, Mengirim pakaian, atau Makanan', b, 520)
                    .text('08.00 sampai dengan selesai', b, 540)
                    .text(tanggal1, b, 560)
                    .text(tanggal2, b, 580);

    

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
}