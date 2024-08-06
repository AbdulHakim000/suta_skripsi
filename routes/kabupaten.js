const router = require('express').Router();
const kabupatenController = require('../controllers/kabupatenController');

router.get('/', kabupatenController.index);
router.post('/add', kabupatenController.add);
router.post('/edit', kabupatenController.update);
router.get('/detail/:id',kabupatenController.detail);
router.get('/edit/:id',kabupatenController.edit);
router.get('/delete/:id',kabupatenController.delete);
module.exports = router;