const router = require('express').Router();
const pembesukController = require('../controllers/pembesukController');

router.get('/', pembesukController.index);
router.get('/tambah', pembesukController.tambah);
router.post('/add', pembesukController.add);
router.post('/edit', pembesukController.update);
router.get('/detail/:nik',pembesukController.detail);
router.get('/edit/:nik',pembesukController.edit);
router.get('/delete/:nik',pembesukController.delete);
module.exports = router;