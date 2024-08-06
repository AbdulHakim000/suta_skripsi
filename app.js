const createError = require('http-errors');
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Swal = require('sweetalert2')

const db = require('./database/conn');
const flash = require('express-flash');
const flash2 = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const jaksaRouter = require('./routes/jaksa');
const pembesukRouter = require('./routes/pembesuk');
const suratRouter = require('./routes/surat');
const provinsiRouter = require('./routes/provinsi');
const kabupatenRouter = require('./routes/kabupaten');
const tahananRouter = require('./routes/tahanan');
const pengajuanRouter = require('./routes/pengajuan');
const pengelolaanRouter = require('./routes/pengelolaan');

const app = express();
const port  = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);

app.use((req, res, next) => {
    req.db = db;
    next();    
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000}
}))



app.use(flash());
// app.use(flash2());

app.use((req, res, next) => {
    res.locals.messages = req.flash(); // Menyimpan pesan flash ke res.locals
    next();
});

app.use(methodOverride("_method"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded( {extended: true}));
app.use(cookieParser());
app.use(express.static('public'));

// app.use('/', indexRouter);
// app.use('/users', userRouter);
app.use('/jaksa', jaksaRouter);
app.use('/pembesuk', pembesukRouter);
app.use('/surat', suratRouter);
app.use('/provinsi', provinsiRouter);
app.use('/kabupaten', kabupatenRouter);
app.use('/tahanan', tahananRouter);
app.use('/pengajuan', pengajuanRouter);
app.use('/pengelolaan', pengelolaanRouter);



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
  console.log(`Example app listening on port ${port}`)
});