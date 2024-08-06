const router = require('express').Router();
const jaksaController = require('../controllers/jaksaController');

router.get('/', jaksaController.index);
router.post('/add', jaksaController.add);
router.post('/edit', jaksaController.update);
router.get('/detail/:nip',jaksaController.detail);
router.get('/edit/:nip',jaksaController.edit);
router.get('/delete/:nip',jaksaController.delete);
module.exports = router;