const router = require('express').Router();
const pengajuanController = require('../controllers/pengajuanController');

router.get('/', pengajuanController.index);
router.post('/add',pengajuanController.addFoto, pengajuanController.add);
router.post('/edit',pengajuanController.addFoto, pengajuanController.update);
router.get('/detail/:id',pengajuanController.detail);
router.get('/edit/:id',pengajuanController.edit);
router.get('/delete/:id',pengajuanController.delete);
module.exports = router;