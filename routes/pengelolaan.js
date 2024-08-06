const router = require('express').Router();
const pengelolaanController = require('../controllers/pengelolaanController');

router.get('/', pengelolaanController.index);
router.post('/add', pengelolaanController.add);
router.post('/edit', pengelolaanController.update);
router.get('/detail/:id',pengelolaanController.detail);
router.get('/edit/:id',pengelolaanController.edit);
router.get('/delete/:id',pengelolaanController.delete);
module.exports = router;