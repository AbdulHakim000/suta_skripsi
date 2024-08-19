const router = require('express').Router();
const lapasController = require('../controllers/lapasController');

router.get('/', lapasController.index);
router.get('/tambah', lapasController.tambah);
router.post('/add', lapasController.addFoto, lapasController.add);
router.post('/edit',lapasController.addFoto, lapasController.update);
router.get('/detail/:id',lapasController.detail);
router.get('/edit/:id',lapasController.edit);
router.get('/delete/:id',lapasController.delete);
router.get('/cetak/', lapasController.cetakPDF);
router.get('/api-data', lapasController.apiData);

module.exports = router;