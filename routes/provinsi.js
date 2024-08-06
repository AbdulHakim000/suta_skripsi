const router = require('express').Router();
const provinsiController = require('../controllers/provinsiController');

router.get('/', provinsiController.index);
router.post('/add', provinsiController.add);
router.post('/edit', provinsiController.update);
router.get('/detail/:id',provinsiController.detail);
router.get('/edit/:id',provinsiController.edit);
router.get('/delete/:id',provinsiController.delete);
module.exports = router;