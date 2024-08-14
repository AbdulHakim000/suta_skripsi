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
router.post('/add', userController.add);
router.post('/edit', userController.update);
router.get('/detail/:id',userController.detail);
router.get('/edit/:id',userController.edit);
router.get('/delete/:id',userController.delete);
module.exports = router;