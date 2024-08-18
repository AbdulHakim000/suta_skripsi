const user = require('../models/userModel');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt'); // Import bcrypt
const PDFDocument = require('pdfkit');
const fs = require('fs');

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
const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'user')); // Pastikan path sesuai
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Penamaan file unik
  }
});

const uploadUser = multer({ 
  storage: storageUser,
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
        loginPage: (req, res) => {
            res.render('login/index', { 
                session: req.session ,
                layout: 'layout/null',
                title: 'Halaman Login',
            });
        },
        registerPage: (req, res) => {
            res.render('register/index', { 
                session: req.session ,
                layout: 'layout/null',
                title: 'Halaman Login',
            });
        },

        login: async (req, res) => {
            try {
                const { email, password } = req.body;

                // Validasi email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    req.session.message = {
                        type: 'error',
                        text: 'Format email tidak valid'
                    };
                    return res.redirect('/user/login');
                }

                // Ambil data pengguna dari database
                const userData = await user.findByEmail(req.db, email);
                if (!userData) {
                    req.session.message = {
                        type: 'error',
                        text: 'Email atau password salah'
                    };
                    return res.redirect('/user/login');
                }

                // Verifikasi password
                const match = await bcrypt.compare(password, userData.password);
                if (!match) {
                    req.session.message = {
                        type: 'error',
                        text: 'Email atau password salah'
                    };
                    return res.redirect('/user/login');
                }

                // Set session user
                req.session.user = userData;
                // Tambahkan log untuk cek
                console.log('User logged in:', req.session.user);
                req.session.message = {
                    type: 'success',
                    text: 'Login berhasil'
                };

                // Redirect ke halaman index
                return res.redirect('/');
            } catch (err) {
                console.error('Error detail:', err);
                req.session.message = {
                    type: 'error',
                    text: 'Terjadi kesalahan saat login: ' + err.message
                };
                res.redirect('/user/login');
            }
        },

        loginProcces: async (req, res) => {
            try {
                const { email, password } = req.body;

                // Validasi email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    req.session.message = {
                        type: 'error',
                        text: 'Format email tidak valid'
                    };
                    return res.redirect('/login');
                }

                // Ambil data pengguna dari database
                const userData = await user.findByEmail(req.db, email);
                if (!userData) {
                    req.session.message = {
                        type: 'error',
                        text: 'Email atau password salah'
                    };
                    return res.redirect('/login');
                }

                // Verifikasi password
                const match = await bcrypt.compare(password, userData.password);
                if (!match) {
                    req.session.message = {
                        type: 'error',
                        text: 'Email atau password salah'
                    };
                    return res.redirect('/login');
                }

                // Set session user
                req.session.user = userData;
                // Tambahkan log untuk cek
                console.log('User logged in:', req.session.user);
                req.session.message = {
                    type: 'success',
                    text: 'Login berhasil'
                };

                // Redirect ke halaman index
                return res.redirect('/');
            } catch (err) {
                console.error('Error detail:', err);
                req.session.message = {
                    type: 'error',
                    text: 'Terjadi kesalahan saat login: ' + err.message
                };
                res.redirect('/login');
            }
        },

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
        user.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message);
                res.render('user/index', { data:'' });
            } else {
                res.render('user/index', {
                    layout: layout,
                    title: 'Halaman user',
                    user: req.session.user,
                    users: rows
                });
            }
        });
    },

    indexAdmin: (req, res) => {
        user.fetchDataAdmin(req.db, (err, rows) => {
            if (err) {
                return res.render('user/index', {
                    layout: 'layout/admin/main',
                    title: 'Halaman User',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    error: 'Terjadi kesalahan saat mengambil data User.', // Menambahkan pesan error
                    users: [] // Pastikan ini diset agar tidak undefined
                });
            } else {
                res.render('user/indexAdmin', {
                    layout: 'layout/admin/main',
                    title: 'Halaman User',
                    users: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                });
            }
        });
    },
    indexStaff: (req, res) => {
        user.fetchDataStaff(req.db, (err, rows) => {
            if (err) {
                return res.render('user/index', {
                    layout: 'layout/admin/main',
                    title: 'Halaman User',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    error: 'Terjadi kesalahan saat mengambil data User.', // Menambahkan pesan error
                    users: [] // Pastikan ini diset agar tidak undefined
                });
            } else {
                res.render('user/indexStaff', {
                    layout: 'layout/admin/main',
                    title: 'Halaman User',
                    users: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                });
            }
        });
    },
    indexPublic: (req, res) => {
        user.fetchDataPublic(req.db, (err, rows) => {
            if (err) {
                return res.render('user/index', {
                    layout: 'layout/admin/main',
                    title: 'Halaman User',
                    user: req.session.user,
                    userRole: req.session.user.role,
                    error: 'Terjadi kesalahan saat mengambil data User.', // Menambahkan pesan error
                    users: [] // Pastikan ini diset agar tidak undefined
                });
            } else {
                res.render('user/indexPublic', {
                    layout: 'layout/admin/main',
                    title: 'Halaman User',
                    users: rows,
                    user: req.session.user,
                    userRole: req.session.user.role,
                });
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
        user.fetchData(req.db, (err, rows) => {
            if (err) {
                req.flash('error', err.message);
                res.render('user/add_modal', { data:'' });
            } else {
                res.render('user/add_modal', {
                    layout: layout,
                    title: 'Halaman user',
                    user: req.session.user,
                    users: rows
                });
            }
        });
    },

    detail: (req, res) => {
     user.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('user/detail_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const user = rows.find(user => user.id === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('user/detail_modal', { 
                layout: layout,
                title: 'Halaman user',
                user: req.session.user,
                user, 
                users: rows})
        }
    });
    },

    edit: (req, res) => {
     user.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('user/edit_modal', { data:''})
        } else {
            const id = parseInt(req.params.id);
            const user = rows.find(user => user.id === id);

            const userRole = req.session.user.role; // Assuming role is stored in req.user
            let layout;
            if (userRole === 'admin') {
                layout = 'layout/admin/main';
            } else if (userRole === 'staff') {
                layout = 'layout/staff/main';
            } else {
                layout = 'layout/public/main';
            }
            res.render('user/edit_modal', { 
                layout: layout,
                title: 'Halaman user',
                user, 
                users: rows})
        }
    });

    
}  ,


    add: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validasi email
            if (!emailRegex.test(email)) {
                req.session.message = {
                    type: 'error',
                    text: 'Format email tidak valid'
                };
                return res.redirect('/user');
            }

            // Validasi panjang password minimal 8 karakter
            if (password.length < 8) {
                req.session.message = {
                    type: 'error',
                    text: 'Password harus memiliki minimal 8 karakter'
                };
                return res.redirect('/user');
            }

            // Enkripsi password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const form_user = {
                username, 
                email, 
                password: hashedPassword, // Menggunakan password yang sudah dienkripsi
                role,
                created_at: new Date() // Mengisi otomatis created_at dengan tanggal dan waktu saat ini
            };

            console.log(form_user);

            await user.insertData(req.db, form_user);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/user');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/user');
        }
    },
    addRegister: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validasi email
            if (!emailRegex.test(email)) {
                req.session.message = {
                    type: 'error',
                    text: 'Format email tidak valid'
                };
                return res.redirect('/register');
            }

            // Validasi panjang password minimal 8 karakter
            if (password.length < 8) {
                req.session.message = {
                    type: 'error',
                    text: 'Password harus memiliki minimal 8 karakter'
                };
                return res.redirect('/register');
            }

            // Enkripsi password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const form_user = {
                username, 
                email, 
                password: hashedPassword, // Menggunakan password yang sudah dienkripsi
                role,
                created_at: new Date() // Mengisi otomatis created_at dengan tanggal dan waktu saat ini
            };

            console.log(form_user);

            await user.insertData(req.db, form_user);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil dimasukkan ke database'
            };
            res.redirect('/register');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memasukkan data: ' + err.message
            };
            res.redirect('/register');
        }
    },

    adduser : (req, res, next) => {
        uploaduser.single('gambar_user')(req, res, (err) => {
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
        return res.redirect('/user');
        }
        // Lanjutkan ke proses penyimpanan data jika tidak ada error
        next();
    });
    },

    update: async (req, res) => {
        try {
            const {id, username, email, password, role } = req.body;
            console.log(req.body);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validasi email
            if (!emailRegex.test(email)) {
                req.session.message = {
                    type: 'error',
                    text: 'Format email tidak valid'
                };
                return res.redirect(`/user/`);
            }

            // Persiapkan objek untuk menyimpan perubahan data
            let form_user = {
                username,
                email,
                role,
                updated_at: new Date() // Mengisi otomatis updated_at dengan tanggal dan waktu saat ini
            };

            // Cek apakah password diubah
            if (password) {
                // Enkripsi password baru jika diubah
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                form_user.password = hashedPassword;
            }

            console.log(form_user);

            await user.updateData(req.db, id, form_user);
            req.session.message = {
                type: 'success',
                text: 'Data berhasil diperbarui'
            };
            res.redirect('/user');
        } catch (err) {
            console.error('Error detail:', err);
            req.session.message = {
                type: 'error',
                text: 'Terjadi kesalahan saat memperbarui data: ' + err.message
            };
            res.redirect(`/user/edit/${id}`);
        }
    },


    delete : (req, res) => {
        const id = parseInt(req.params.id); // Mengambil id dari parameter URL
        console.log(id);
        user.deleteData(req.db, id, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/user');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/user');
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
        .text('LAPORAN DATA USER', 260, 160)
        .moveDown();
        // bagian isi tabel

    try {
        const result = await query('SELECT * FROM user');
        console.log('Query result:', result);
        const users = result;

        if (!Array.isArray(users)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const columnWidths = [30, 150, 220, 100]; // Lebar setiap kolom
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
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (users.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(10) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Username', 120, tableTop)
                .text('email', 270, tableTop)
                .text('Role', 500, tableTop);
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
                .fontSize(10); // Ukuran font data tabel
            users.forEach((user, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(user.username, 93, y)
                    .text(user.email, 244, y)
                    .text(user.role, 500, y);

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

    cetakPDFAdmin: async (req, res) => {

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
        .text('LAPORAN DATA USER ROLE ADMIN', 220, 160)
        .moveDown();
        // bagian isi tabel

    try {
        const result = await query("SELECT * FROM user WHERE role ='admin'");
        console.log('Query result:', result);
        const users = result;

        if (!Array.isArray(users)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const columnWidths = [30, 150, 220, 100]; // Lebar setiap kolom
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
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (users.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(10) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Username', 120, tableTop)
                .text('email', 270, tableTop)
                .text('Role', 500, tableTop);
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
                .fontSize(10); // Ukuran font data tabel
            users.forEach((user, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(user.username, 93, y)
                    .text(user.email, 244, y)
                    .text(user.role, 500, y);

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

cetakPDFStaff: async (req, res) => {

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
        .text('LAPORAN DATA USER ROLE STAFF', 220, 160)
        .moveDown();
        // bagian isi tabel

    try {
        const result = await query("SELECT * FROM user WHERE role ='staff'");
        console.log('Query result:', result);
        const users = result;

        if (!Array.isArray(users)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const columnWidths = [30, 150, 220, 100]; // Lebar setiap kolom
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
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (users.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(10) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Username', 120, tableTop)
                .text('email', 270, tableTop)
                .text('Role', 500, tableTop);
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
                .fontSize(10); // Ukuran font data tabel
            users.forEach((user, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(user.username, 93, y)
                    .text(user.email, 244, y)
                    .text(user.role, 500, y);

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

cetakPDFPublic: async (req, res) => {

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
        .text('LAPORAN DATA USER ROLE PUBLIC', 220, 160)
        .moveDown();
        // bagian isi tabel

    try {
        const result = await query("SELECT * FROM user WHERE role ='public'");
        console.log('Query result:', result);
        const users = result;

        if (!Array.isArray(users)) {
            throw new Error('Hasil query bukan array');
        }
        const tableTop = 200;
        const rowSpacing = 20;
        const columnWidths = [30, 150, 220, 100]; // Lebar setiap kolom
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
                .lineTo(x, tableTop + (rowSpacing - 0.5) * (users.length + 1))
                .stroke();
        }

        // Fungsi untuk menggambar baris dan garis secara otomatis
        function drawTable() {
            // Header tabel
            doc.font('Helvetica-Bold')
                .fontSize(10) // Ukuran font header tabel
                .text('No', 70, tableTop)
                .text('Username', 120, tableTop)
                .text('email', 270, tableTop)
                .text('Role', 500, tableTop);
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
                .fontSize(10); // Ukuran font data tabel
            users.forEach((user, i) => {
                const y = tableTop + (i + 1) * rowSpacing;

                doc.text(i + 1, 70, y)
                    .text(user.username, 93, y)
                    .text(user.email, 244, y)
                    .text(user.role, 500, y);

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
            const tanggal2 = formatIndonesianDate(surat.tanggal1);
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