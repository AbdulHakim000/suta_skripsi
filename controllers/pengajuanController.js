const pengajuan = require('../models/pengajuanModel');
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


//     edit: (req, res) => {
//      pengajuan.fetchData(req.db, (err, rows) => {
//         if (err) {
//             req.flash('error', err.message); 
//             res.render('admin/pengajuan/edit_modal', { data:''})
//         } else {
//             const id = parseInt(req.params.id);
//             const pengajuan = rows.find(pengajuan => pengajuan.id === id);
//             const userRole = req.session.user.role; // Assuming role is stored in req.user
            
//             let layout;
//             if (userRole === 'admin') {
//                 layout = 'layout/admin/main';
//             } else if (userRole === 'staff') {
//                 layout = 'layout/staff/main';
//             } else {
//                 layout = 'layout/public/main';
//             }           
//             res.render('admin/pengajuan/edit_modal', { 
//                 layout: layout,
//                 title: layout,
//                 user: req.session.user,
//                 userRole: req.session.user.role,
//                 pengajuan, 
//                 pengajuans: rows})
//         }
//     });
// },

    add : async (req, res) => {
        try {
            console.log('File received:', req.file); // Periksa apakah file diterima
            console.log('Request body:', req.body);

            const {
                nama_pembesuk, alamat_pembesuk, pekerjaan_pembesuk, hubungan, registrasi_tahanan, nama_tahananx, tanggal_besuk, status_pengajuan} = req.body;

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
        const {id, nama_pembesuk, alamat_pembesuk, pekerjaan_pembesuk, hubungan, registrasi_tahanan, nama_tahananx, tanggal_besuk, pengajuan_by, tgl_pengajuan, status_pengajuan, old_gambar_ktp} = req.body;
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
        const {id, nama_pembesuk, alamat_pembesuk, pekerjaan_pembesuk, hubungan, registrasi_tahanan, nama_tahananx, tanggal_besuk, pengajuan_by, tgl_pengajuan, status_pengajuan, old_gambar_ktp} = req.body;
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

    approvePengajuan: (db, pengajuanId, callback) => {
            // Call the updateStatus function from the model and pass 'approved' as the status
            pengajuan.updateStatus(db, pengajuanId, 'Diterima', (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            });
        },
    rejectPengajuan: (db, pengajuanId, callback) => {
            // Call the updateStatus function from the model and pass 'approved' as the status
            pengajuan.updateStatus(db, pengajuanId, 'Ditolak', (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
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
        .text('LAPORAN DATA PENGAJUAN', 360, 160)
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
}