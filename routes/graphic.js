const express = require('express');
const router = express.Router();
const graphicController = require('../controllers/graphicController');

// Pastikan `getTahananData` didefinisikan di `graphicController`
router.get('/data-persentase-perkara', graphicController.getPersentasePerkara);
router.get('/persentase-perkara', (req, res) => {
    res.render('admin/graphic/perkara',{
        layout: 'layout/admin/main',
        title: 'Halaman Graphic',
        user: req.session.user,
    });
});

// route buat tahanan narkotika per provinsi
router.get('/data-persentase-narkotika-perprovinsi', graphicController.getTahananNarkotikaPerProvinsi);
router.get('/persentase-perprovinsi', (req, res) => {
    res.render('admin/graphic/provinsi',{
        layout: 'layout/admin/main',
        title: 'Halaman Graphic',
        user: req.session.user,
    });
});

// route buat tahanan oharda per provinsi
router.get('/data-persentase-oharda-perprovinsi', graphicController.getTahananOhardaPerProvinsi);

// route buat tahanan kamtibum per provinsi
router.get('/data-persentase-kamtibum-perprovinsi', graphicController.getTahananKamtibumPerProvinsi);

// route buat tahanan narkotika berdasarkan umurnya
router.get('/data-persentase-umur-narkotika', graphicController.getTahananUmurNarkotika);
router.get('/data-persentase-umur-oharda', graphicController.getTahananUmurOharda);
router.get('/data-persentase-umur-kamtibum', graphicController.getTahananUmurKamtibum);
router.get('/persentase-umur', (req, res) => {
    res.render('admin/graphic/umur',{
        layout: 'layout/admin/main',
        title: 'Halaman Graphic',
        user: req.session.user,
    });
});

router.get('/data-pengajuan-pertanggal', graphicController.getPengajuanPerTanggal);
router.get('/data-pengajuan-perbulan', graphicController.getPengajuanPerBulan);
router.get('/jumlah-pengajuan', (req, res) => {
    res.render('admin/graphic/pengajuan',{
        layout: 'layout/admin/main',
        title: 'Halaman Graphic',
        user: req.session.user,
    });
});

router.get('/data-jenis-kelamin',graphicController.getPersentaseJenisKelamin);
router.get('/jenis-kelamin',(req, res) => {
    res.render('admin/graphic/jenisKelamin',{
        layout: 'layout/admin/main',
        title: 'Halaman Graphic Jenis Kelamin',
        user: req.session.user,
    });
});

module.exports = router;