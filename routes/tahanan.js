const router = require('express').Router();
const tahananController = require('../controllers/tahananController');

router.get('/', tahananController.index);
router.post('/add', tahananController.add);
router.post('/edit', tahananController.update);
router.get('/detail/:id',tahananController.detail);
router.get('/edit/:id',tahananController.edit);
router.get('/delete/:id',tahananController.delete);
module.exports = router;