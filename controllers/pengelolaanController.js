const pengelolaan = require('../models/pengelolaanModel');
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

// Konfigurasi penyimpanan Foto barbuk
const storageBarbuk = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'barang_bukti')); // Pastikan path sesuai
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Penamaan file unik
  }
});

const uploadBarbuk = multer({ 
  storage: storageBarbuk,
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
        // ambil data pengelolaan
        pengelolaan.fetchData(req.db, (errPengelolaan, rowsPengelolaan) => {
            if (errPengelolaan) {
                req.flash('error', errPengelolaan.message);
                return res.render('admin/pengelolaan/index', { pengelolaans: [], tahananas: [] });
            } 
            // ambil data tahanan
            pengelolaan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/pengelolaan/index', { pengelolaans: rowsPengelolaan, tahanans: [] });
                }
                // ambil data jaksa
                pengelolaan.fetchDataJaksa(req.db, (errJaksa, rowsJaksa) => {
                    if (errJaksa) {
                        req.flash('error', errJaksa.message);
                        return res.render('admin/pengelolaan/index', { pengelolaans: rowsPengelolaan, tahanans: rowsTahanan, jaksa: [] });
                    }

                    const userRole = req.session.user.role; // Assuming role is stored in req.user
                    let layout;
                    
                    if (userRole === 'admin') {
                        layout = 'layout/admin/main';
                    } else if (userRole === 'staff') {
                        layout = 'layout/staff/main';
                    } else {
                        layout = 'layout/public/main';
                    }
                    // render view dengan ketiga data
                        res.render('admin/pengelolaan/index', {
                            layout: layout,
                            title: 'Halaman pengelolaan',
                            userRole: req.session.user.role,
                            user: req.session.user,
                            pengelolaans: rowsPengelolaan,
                            tahanans: rowsTahanan,
                            jaksas: rowsJaksa
                });
            });
        });
    });
    },
    tambah: (req, res) => {
        // ambil data pengelolaan
        pengelolaan.fetchData(req.db, (errPengelolaan, rowsPengelolaan) => {
            if (errPengelolaan) {
                req.flash('error', errPengelolaan.message);
                return res.render('admin/pengelolaan/add_modal', { pengelolaans: [], tahananas: [] });
            } 
            // ambil data tahanan
            pengelolaan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/pengelolaan/add_modal', { pengelolaans: rowsPengelolaan, tahanans: [] });
                }
                // ambil data jaksa
                pengelolaan.fetchDataJaksa(req.db, (errJaksa, rowsJaksa) => {
                    if (errJaksa) {
                        req.flash('error', errJaksa.message);
                        return res.render('admin/pengelolaan/add_modal', { pengelolaans: rowsPengelolaan, tahanans: rowsTahanan, jaksa: [] });
                    }

                    const userRole = req.session.user.role; // Assuming role is stored in req.user
                    let layout;
                    
                    if (userRole === 'admin') {
                        layout = 'layout/admin/main';
                    } else if (userRole === 'staff') {
                        layout = 'layout/staff/main';
                    } else {
                        layout = 'layout/public/main';
                    }
                    // render view dengan ketiga data
                        res.render('admin/pengelolaan/add_modal', {
                            layout: layout,
                            title: 'Halaman pengelolaan',
                            userRole: req.session.user.role,
                            user: req.session.user,
                            pengelolaans: rowsPengelolaan,
                            tahanans: rowsTahanan,
                            jaksas: rowsJaksa
                });
            });
        });
    });
    },


    detail: (req, res) => {
     pengelolaan.fetchJoinedData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('admin/pengelolaan/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const pengelolaan = rows.find(pengelolaan => pengelolaan.id === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('admin/pengelolaan/detail_modal', { 
                layout: layout,
                title: 'Halaman pengelolaan',
                userRole: req.session.user.role,
                user: req.session.user,
                pengelolaan, 
                pengelolaans: rows})
        }
    });
    },


    edit: (req, res) => {
        // ambil data pengelolaan
        pengelolaan.fetchData(req.db, (errPengelolaan, rowsPengelolaan) => {
            if (errPengelolaan) {
                req.flash('error', errPengelolaan.message);
                return res.render('admin/pengelolaan/edit_modal', { pengelolaans: [], tahananas: [] });
            } 
            // ambil data tahanan
            pengelolaan.fetchDataTahanan(req.db, (errTahanan, rowsTahanan) => {
                if (errTahanan) {
                    req.flash('error', errTahanan.message);
                    return res.render('admin/pengelolaan/edit_modal', { pengelolaans: rowsPengelolaan, tahanans: [] });
                }
                // ambil data jaksa
                pengelolaan.fetchDataJaksa(req.db, (errJaksa, rowsJaksa) => {
                    if (errJaksa) {
                        req.flash('error', errJaksa.message);
                        return res.render('admin/pengelolaan/edit_modal', { pengelolaans: rowsPengelolaan, tahanans: rowsTahanan, jaksa: [] });
                    }
                    const id = parseInt(req.params.id);
                    const pengelolaan = rowsPengelolaan.find(pengelolaan =>  pengelolaan.id === id);
                    // render view dengan ketiga data
                        const userRole = req.session.user.role; // Assuming role is stored in req.user
                        let layout;
                        if (userRole === 'admin') {
                            layout = 'layout/admin/main';
                        } else if (userRole === 'staff') {
                            layout = 'layout/staff/main';
                        } else {
                            layout = 'layout/public/main';
                        }
                        res.render('admin/pengelolaan/edit_modal', {
                            layout: layout,
                            title: 'Halaman pengelolaan',
                            pengelolaan,
                            userRole: req.session.user.role,
                            user: req.session.user,
                            pengelolaans: rowsPengelolaan,
                            tahanans: rowsTahanan,
                            jaksas: rowsJaksa
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
                registrasi_perkara, registrasi_tahanan, kronologi, jaksa1,   jaksa2, jaksa3, jaksa4, barang_bukti, melanggar_pasal, lapas, durasi_penahanan, tgl_penuntutan} = req.body;

                const form_pengelolaan = {
                    registrasi_perkara, 
                    registrasi_tahanan, 
                    kronologi, 
                    jaksa1, 
                    jaksa2, 
                    jaksa3, 
                    jaksa4, 
                    barang_bukti,
                    melanggar_pasal, 
                    lapas, 
                    durasi_penahanan, 
                    tgl_penuntutan,
                    gambar_barbuk: req.file ? req.file.filename : null // Periksa apakah req.file berisi file
                 }

            console.log(form_pengelolaan);

            await pengelolaan.insertData(req.db, form_pengelolaan);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/pengelolaan');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/pengelolaan');
        }
    },

addFoto : (req, res, next) => {
        uploadBarbuk.single('gambar_barbuk')(req, res, (err) => {
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
        return res.redirect('/pengelolaan');
        }
        // Lanjutkan ke proses penyimpanan data jika tidak ada error
        next();
    });
    },
    

        update: async (req, res) => {
                const {id, registrasi_perkara, registrasi_tahanan, kronologi, jaksa1, jaksa2, jaksa3, jaksa4, barang_bukti, melanggar_pasal, lapas, durasi_penahanan, tgl_penuntutan, old_gambar_barbuk} = req.body;
                // Check if a new image is uploaded

                console.log('Uploaded file:', req.file); // Debugging line
                const new_gambar_barbuk = req.file ? req.file.filename : old_gambar_barbuk;

                const form_pengelolaan = {
                    id,
                    registrasi_perkara, 
                    registrasi_tahanan, 
                    kronologi, 
                    jaksa1, 
                    jaksa2, 
                    jaksa3, 
                    jaksa4, 
                    barang_bukti, 
                    melanggar_pasal, 
                    lapas, 
                    durasi_penahanan, 
                    tgl_penuntutan,
                    gambar_barbuk: new_gambar_barbuk
                };

                console.log(form_pengelolaan);
                try {
                    // Mengupdate data dengan menggunakan async/await
                    await pengelolaan.updateData(req.db, id, form_pengelolaan);
                    
                    req.session.message = {
                        type: 'success',
                        text: 'Data berhasil terUpdate'
                    };
                    res.redirect('/pengelolaan');
                } catch (err) {
                    console.error('Error detail:', err);
                    req.session.message = {
                        type: 'error',
                        text: 'Terjadi kesalahan saat Mengupadte data: ' + err.message
                    };
                    res.redirect('/pengelolaan');
                }
    },
    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        pengelolaan.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/pengelolaan');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/pengelolaan');
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
        .text('LAPORAN PENGELOLAAN DATA TAHANAN', 300, 160)
        .moveDown();


    try {
        const result = await query("SELECT pengelolaan.*, tahanan.nama_tahanan, tahanan.perkara, tahanan.tgl_lahir, tahanan.pekerjaan FROM pengelolaan INNER JOIN tahanan ON pengelolaan.registrasi_tahanan = tahanan.registrasi_tahanan");
        console.log('Query result:', result);
        const pengelolaans = result;

        if (!Array.isArray(pengelolaans)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const maxRowsPerPage = Math.floor((doc.page.height - 260) / rowSpacing); // Menghitung jumlah baris maksimal per halaman
        const columnWidths = [30, 70, 110,100,200, 100,50,80,]; // Lebar setiap kolom
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
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (pengelolaans.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(7) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Reg Perkara', 100, tableTop)
                .text('Perkara', 180, tableTop)
                .text('Registrasi Tahanan', 290, tableTop)
                .text('Nama Tahanan', 400, tableTop)
                .text('Lapas', 594, tableTop)
                .text('Durasi', 678, tableTop - 4)
                .text('Penahanan', 678, tableTop + 6)
                .text('Tanggal Penuntutan', 736, tableTop - 4)

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
            pengelolaans.forEach((pengelolaan, i) => {
                const y = tableTop + (i + 1) * rowSpacing;
                const tgl = formatIndonesianDate(new Date(pengelolaan.tgl_penuntutan));
                
                doc.text(i + 1, 70, y)
                    .text(pengelolaan.registrasi_perkara, 94,y)
                    .text(pengelolaan.perkara, 164,y)
                    .text(pengelolaan.registrasi_tahanan, 290,y)
                    .text(pengelolaan.nama_tahanan, 374,y)
                    .text(pengelolaan.lapas, 575,y)
                    .text(pengelolaan.durasi_penahanan, 680,y)
                    .text(tgl, 724,y)
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
}