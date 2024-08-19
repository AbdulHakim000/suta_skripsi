const router = require('express').Router();
const userController = require('../controllers/userController');

//menampilkan halaman login
router.get('/login', userController.loginPage);
// Proses login
router.post('/login', userController.login);
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/user/login' , { 
                session: req.session ,
                layout: 'layout/main',
                title: 'Halaman Index',
            });
    });
});
router.get('/', userController.index);
router.get('/admin', userController.indexAdmin);
router.get('/staff', userController.indexStaff);
router.get('/public', userController.indexPublic);
router.get('/tambah', userController.tambah);
router.post('/add', userController.add);
router.post('/edit', userController.update);
router.get('/detail/:id',userController.detail);
router.get('/edit/:id',userController.edit);
router.get('/delete/:id',userController.delete);
router.get('/cetak',userController.cetakPDF);
router.get('/cetak/admin',userController.cetakPDFAdmin);
router.get('/cetak/staff',userController.cetakPDFStaff);
router.get('/cetak/public',userController.cetakPDFPublic);

router.get('/download-excel',userController.downloadExcel);

module.exports = router;