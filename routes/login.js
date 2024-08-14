const router = require('express').Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.loginPage);
router.post('/', loginController.loginProcces);
module.exports = router;