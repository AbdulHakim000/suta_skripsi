const router = require('express').Router();
const pengajuanController = require('../controllers/pengajuanController');

router.get('/', pengajuanController.index);
router.post('/add', pengajuanController.add);
router.post('/edit', pengajuanController.update);
router.get('/detail/:id',pengajuanController.detail);
router.get('/edit/:id',pengajuanController.edit);
router.get('/delete/:id',pengajuanController.delete);
module.exports = router;