var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/user');
var User = mongoose.model('User');

module.exports = function(passport) {
	router.post('/auth/signup', function(req, res, next) {
		passport.authenticate('signup', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				res.send({
					type: "danger",
					message: "This user already exists!"
				})
			} 
			if (user) {
				res.send({
					type: "success",
					message: "Successfully signed up! Log in with your information."
				})
			}
		})(req, res, next);
	});
	router.post('/auth/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				res.send({
					type: "danger",
					message: "User not found!"
				})
			} 
			if (user) {
				req.login(user, function(err) {
					if (err) return next(err);
					res.send({
						type: "success",
						message: "Successfully signed in!",
						user: req.user
					})
					$window.history.back();
				})
			}
		})(req, res, next);
	});
	router.get('/signout', function(req, res) {
		req.logout();
		req.session.destroy();
		res.render('index');
	});
	router.get('/currentuser', function(req, res) {
		res.send({
			user: req.user
		});
	});
	return router;
}