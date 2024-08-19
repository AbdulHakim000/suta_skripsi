const router = require('express').Router();
const suratController = require('../controllers/suratController');

router.get('/', suratController.index);
router.get('/tambah', suratController.tambah);
router.post('/add', suratController.add);
router.post('/edit', suratController.update);
router.get('/detail/:id',suratController.detail);
router.get('/edit/:id',suratController.edit);
router.get('/delete/:id',suratController.delete);
router.get('/cetak', (req, res) => {
    console.log('Route accessed');
    suratController.cetakPDF(req, res);
});
router.get('/cetak/:id', (req, res) => {
    console.log('Route accessed');
    suratController.cetakPDFSurat(req, res);
});
router.get('/download-excel', suratController.downloadExcel);
router.get('/download-csv', suratController.downloadCSV);
router.get('/api-data', suratController.apiData);
module.exports = router;