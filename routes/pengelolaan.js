const router = require('express').Router();
const pengelolaanController = require('../controllers/pengelolaanController');

router.get('/', pengelolaanController.index);
router.post('/add', pengelolaanController.addFoto, pengelolaanController.add);
router.post('/edit', pengelolaanController.addFoto, pengelolaanController.update);
router.get('/detail/:id',pengelolaanController.detail);
router.get('/edit/:id',pengelolaanController.edit);
router.get('/delete/:id',pengelolaanController.delete);
module.exports = router;