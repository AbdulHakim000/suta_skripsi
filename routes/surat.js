const router = require('express').Router();
const suratController = require('../controllers/suratController');

router.get('/', suratController.index);
router.get('/tambah', suratController.tambah);
router.post('/add', suratController.add);
router.post('/edit', suratController.update);
router.get('/detail/:id',suratController.detail);
router.get('/edit/:id',suratController.edit);
router.get('/delete/:id',suratController.delete);
module.exports = router;