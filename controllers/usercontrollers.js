const { body, validationResult } = require('express-validator');
const path = require('path');
const bcrypt = require('bcryptjs');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Message = require('../models/message');
//set up session + passport

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username' });
			}
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					// passwords match! log user in
					return done(null, user);
				} else {
					// passwords do not match!
					return done(null, false, { message: 'password is wrong' });
				}
			});
		});
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
exports.index = (req, res, next) => {
	Message.find()
		.populate('userCreated')
		.exec((err, results) => {
			if (err) {
				return next(err);
			}
			if (results.length === 0) {
				res.render('index', {
					title: 'No messages',
					currentUser: req.user,
				});
				return;
			}
			res.render('index', {
				title: 'Messages',
				messages: results,
				currentUser: req.user,
			});
		});
};
exports.signupGet = (req, res, next) => {
	if (req.user) {
		return res.redirect('/');
	}
	res.render('user-form', {
		title: 'Sign up',
	});
};
exports.signupPost = [
	body('firstName', 'First name must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('lastName', 'Last name must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('username', 'Username must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('password', 'Password must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('password', 'Password must have at least 6 characters')
		.trim()
		.isLength({ min: 6 })
		.escape(),
	body('password', 'Password and the Confirm Password must match').custom(
		(value, { req }) => value === req.body.confirmedPassword
	),
	(req, res, next) => {
		const isAdmin = req.body.isAdmin == 'true' ? true : false;
		const errors = validationResult(req);
		bcrypt.hash(req.body.password, 10, function (err, hash) {
			const user = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				username: req.body.username,
				password: hash,
				membershipStatus: req.body.membershipStatus,
				isAdmin: req.body.isAdmin,
			});
			if (!errors.isEmpty()) {
				res.render('user-form', {
					title: 'Sign Up',
					user: user,
					errors: errors.array(),
				});
				return;
			}
			user.save((err) => {
				if (err) return next(err);
				res.redirect('/');
			});
		});
	},
];
exports.joinClubGet = function (req, res, next) {
	if (!req.user) {
		return res.redirect('/');
	}
	res.render('join-club', {
		title: 'Join Club',
	});
};

exports.loginGet = function (req, res, next) {
	if (req.user) {
		return res.redirect('/');
	}
	res.render('login', {
		title: 'Login',
	});
};

exports.loginPost = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (info !== undefined) {
			res.render('login', {
				title: 'Login',
				user: { username: req.body.username },
				errors: [{ msg: info.message }],
			});

			return;
		}
		res.redirect('/');
	},
});

exports.logoutGet = (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};
exports.joinClubPost = function (req, res, next) {
	if (req.body.passcode === 'vipclub') {
		User.findById(req.params.id).exec((err, user) => {
			if (err) return next(err);
			if (!user) {
				res.redirect('/');
				return;
			}
			const theUser = new User({
				user,
				membershipStatus: 'veteran',
				_id: req.params.id,
			});
			User.findByIdAndUpdate(
				req.params.id,
				theUser,
				{},
				(err, updatedUser) => {
					if (err) return next(err);
					res.redirect('/');
				}
			);
		});
	} else {
		return res.render('join-club', {
			title: 'Join Club',
			error: 'Wrong passcode',
		});
	}
};

exports.createMessageGet = (req, res, next) => {
	res.render('create-message', {
		title: 'Create Message',
		currentUser: req.user,
	});
};
exports.createMessagePost = (req, res, next) => {
	const message = new Message({
		title: req.body.title,
		text: req.body.message,
		dateCreated: new Date(),
		userCreated: req.user,
	});
	message.save((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};

exports.messageDeleteGet = (req, res, next) => {
	res.render('delete-message', {
		messageId: req.params.id,
	});
};
exports.messageDeletePost = (req, res, next) => {
	console.log(req.body.m);
	Message.findByIdAndRemove(req.body.messageId, (err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};
