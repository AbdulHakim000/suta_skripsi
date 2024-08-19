const router = require('express').Router();
const pembesukController = require('../controllers/pembesukController');

router.get('/', pembesukController.index);
router.get('/tambah', pembesukController.tambah);
router.post('/add', pembesukController.add);
router.post('/edit', pembesukController.update);
router.get('/detail/:nik',pembesukController.detail);
router.get('/edit/:nik',pembesukController.edit);
router.get('/delete/:nik',pembesukController.delete);
router.get('/cetak', (req, res) => {
    console.log('Route accessed');
    pembesukController.cetakLaporanPembesuk(req, res);
});

router.get('/download-excel',pembesukController.downloadExcel);
router.get('/download-CSV',pembesukController.downloadCSV);
module.exports = router;