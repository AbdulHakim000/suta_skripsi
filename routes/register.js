const router = require('express').Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.registerPage);
router.post('/add', loginController.addRegister);
module.exports = router;
