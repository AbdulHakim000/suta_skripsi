const router = require('express').Router();
const pengelolaanController = require('../controllers/pengelolaanController');

router.get('/', pengelolaanController.index);
router.get('/pengajuan/', pengelolaanController.index);
router.get('/tambah', pengelolaanController.tambah);
router.post('/add', pengelolaanController.addFoto, pengelolaanController.add);
router.post('/edit', pengelolaanController.addFoto, pengelolaanController.update);
router.get('/detail/:id',pengelolaanController.detail);
router.get('/edit/:id',pengelolaanController.edit);
router.get('/delete/:id',pengelolaanController.delete);

router.get('/cetak', (req, res) => {
    console.log('Route accessed');
    pengelolaanController.cetakPDF(req, res);
});

router.get('/download-excel',pengelolaanController.downloadExcel);
module.exports = router;