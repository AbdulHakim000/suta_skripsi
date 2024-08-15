const router = require('express').Router();
const tahananController = require('../controllers/tahananController');

router.get('/', tahananController.index);
router.get('/tambah', tahananController.tambah);
router.post('/add', tahananController.addTahanan, tahananController.add);
router.post('/edit',tahananController.addTahanan, tahananController.update);
router.get('/detail/:id',tahananController.detail);
router.get('/edit/:id',tahananController.edit);
router.get('/delete/:id',tahananController.delete);
module.exports = router;