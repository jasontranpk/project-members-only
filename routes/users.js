var express = require('express');
var router = express.Router();
const userController = require('../controllers/usercontrollers');
const User = require('../models/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.get('/logout', userController.logoutGet);
router.get('/:id/join-club', userController.joinClubGet);
router.post('/:id/join-club', userController.joinClubPost);
router.get('/create-message', userController.createMessageGet);
router.post('/create-message', userController.createMessagePost);
module.exports = router;
