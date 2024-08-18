const createError = require('http-errors');
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Swal = require('sweetalert2');
const { isAuthenticated } = require('./middlewares/authMiddleware');


const db = require('./database/conn');
// const flash = require('express-flash');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
// const upload = multer({
//     dest: 'public/images/jaksa', // Tentukan direktori penyimpanan
//     limits: { fileSize: 1024 * 1024 * 2 }, // Maksimal 2MB
// });


const jaksaRouter = require('./routes/jaksa');
const pembesukRouter = require('./routes/pembesuk');
const suratRouter = require('./routes/surat');
const provinsiRouter = require('./routes/provinsi');
const kabupatenRouter = require('./routes/kabupaten');
const tahananRouter = require('./routes/tahanan');
const pengajuanRouter = require('./routes/pengajuan');
const pengelolaanRouter = require('./routes/pengelolaan');
const userRouter = require('./routes/user');
const lapasRouter = require('./routes/lapas');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

const app = express();
const port  = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);

// Middleware global untuk menangani upload file
// app.use(upload.single('gambar_jaksa'));

// database middleware
app.use((req, res, next) => {
  req.db = db;
    next();    
});

// session middleware
app.use(session({ 
  secret: 'secret', 
  resave: false, 
  saveUninitialized: true ,
  cookie: { maxAge: 6000000 } // 1 menit
}));
app.use(flash());
// app.use(flash2());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use((req, res, next) => {
  res.locals.message = req.session.message || null;
  delete req.session.message;
  next();
});


app.use(methodOverride("_method"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded( {extended: false}));

// Route untuk mengupload file
// app.post('/jaksa/add', jaksaController.addJaksa, jaksaController.add); 
// app.post('/jaksa/edit', jaksaController.addJaksa, jaksaController.update);

// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// autentikasi user
// Rute yang memerlukan autentikasi
app.get('/', isAuthenticated, (req, res) => {
    console.log('User session:', req.session.user);  // Debugging

    const userRole = req.session.user.role; // Assuming role is stored in req.user

    let layout;
    if (userRole === 'admin') {
        layout = 'layout/admin/main';
    } else if (userRole === 'staff') {
        layout = 'layout/staff/main';
    } else {
        layout = 'layout/public/main';
    }

    console.log('Layout:', layout);  // Debuggin
    res.render('index', { 
      user: req.session.user ,
      layout: layout,
      title: 'Halaman user',
    });
});
// app.get('/jaksa', isAuthenticated, (req, res) => {
//     console.log('User session:', req.session.user);  // Debugging
//     res.render('jaksa/', { 
//       user: req.session.user ,
//       layout: 'layout/main',
//       title: 'Halaman Jaksa',
//     });
// });

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Terjadi kesalahan saat logout.');
        }
        res.redirect('/login'); // Ganti dengan halaman yang sesuai setelah logout
    });
});
app.use('/jaksa',isAuthenticated, jaksaRouter);
app.use('/pembesuk',isAuthenticated, pembesukRouter);
app.use('/surat', suratRouter);
app.use('/provinsi',isAuthenticated, provinsiRouter);
app.use('/kabupaten',isAuthenticated, kabupatenRouter);
app.use('/tahanan',isAuthenticated, tahananRouter);
app.use('/pengajuan', pengajuanRouter);
app.use('/pengelolaan',isAuthenticated, pengelolaanRouter);
app.use('/user', userRouter);
app.use('/lapas', lapasRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);


// error handling middleware






// Halaman Awal
app.get('/', (req, res) => {
  const mhs = [
    {
      nama:"abdul",
      npm:"2010010771"
    },
    {
      nama:"hakim",
      npm:"2010010772"
    },
    {
      nama:"Bang",
      npm:"2010010773"
    },
  ]

  res.render('index', { 
    layout: 'layout/main',
    nama: 'Abdul',
    title: 'Halaman Utama',
    mahasiswa: mhs
  });
});


app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>404</h1>') ;
    });

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});