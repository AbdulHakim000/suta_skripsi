const router = require('express').Router();
const jaksaController = require('../controllers/jaksaController');

router.get('/', jaksaController.index);
router.get('/tambah', jaksaController.tambah);
router.post('/add',jaksaController.addJaksa, jaksaController.add);
router.post('/edit',jaksaController.addJaksa, jaksaController.update);
router.get('/detail/:nip',jaksaController.detail);
router.get('/edit/:nip',jaksaController.edit);
router.get('/delete/:nip',jaksaController.delete);
module.exports = router;