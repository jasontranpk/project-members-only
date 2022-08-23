var express = require('express');
const { check } = require('express-validator');
const session = require('express-session');
var router = express.Router();
const userController = require('../controllers/usercontrollers');

/* GET home page. */
router.get('/', userController.index);
router.get('/sign-up', userController.signupGet);
router.post('/sign-up', userController.signupPost);

router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);

router.get('/messages/:id/delete', userController.messageDeleteGet);
router.post('/messages/:id/delete', userController.messageDeletePost);

module.exports = router;
