var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
require('../models/user');
var User = mongoose.model('User');
var http = require('http').Server(app);
var io = require('socket.io')(http);
router.get('/authenticated', function(req, res) {
	res.send({
		auth: req.isAuthenticated(),
		user: req.user
	});
});
router.get('/user/:name', function(req, res) {
	console.log(req.params.name);
	User.findOne({
		'username': req.params.name
	}, function(err, user) {
		if (err) {
			console.log(err)
			res.send({
				user: "error"
			});
		}
		if (!user) {
			res.send({
				user: "error"
			});
		}
		if (user) {
			res.send({
				user: user
			});
		}
	});
});
router.get('/error', function(req, res) {
	console.log('rendering error')
	res.render('error');
})
router.post('/user/:name', function(req, res) {
	console.log(req.params.name);
	User.findOneAndUpdate({
			'username': req.params.name
		}, {
			$push: {
				"posts": {
					createdby: req.body.createdby,
					url: req.body.url,
					caption: req.body.caption,
					date: req.body.date,
					likedby: req.body.likedby,
					comments: req.body.comments
				}
			}
		}, {
			safe: true,
			upsert: true
		},
		function(err, user) {
			if (err) {
				res.send({
					type: "danger",
					message: "An unexpected error has occurred."
				})
			}
			if (user) {
				res.send({
					type: "success",
					message: "Posted successfully."
				});
			}
		});
});
router.post('/updateuser/:name', function(req, res) {
	User.findOneAndUpdate({
			'username': req.params.name
		}, {
			$set: {
				'profileurl': req.body.url,
				'bio': req.body.bio
			}
		}, {
			safe: true,
			upsert: true
		},
		function(err, user) {
			if (err) {
				res.send({
					type: "danger",
					message: "An unexpected error has occurred."
				})
			}
			if (user) {
				res.send({
					type: "success",
					message: "Updated successfully."
				});
			}
		});
});
router.get('/profile/:id', function(req, res) {
	res.render('profile', {
		name: req.params.id
	});
	console.log(req.params.id)
});
router.post('/like/:name', function(req, res) {
	User.findOneAndUpdate({
		'username': req.params.name,
		"posts.url": req.body.url
	}, {
		$push: {
			"posts.$.likedby": req.body.name
		}
	}, {
		safe: true,
		upsert: true,
		new: true
	}, function(err, user) {
		if (err) {
			console.log(err);
			res.send(err)
		}
		if (user) {
			// USER STUFF HERE
		}
	});
})
router.post('/unlike/:name', function(req, res) {
	User.findOneAndUpdate({
		'username': req.params.name,
		"posts.url": req.body.url
	}, {
		$pull: {
			"posts.$.likedby": req.body.name
		}
	}, {
		safe: true,
		upsert: true,
		new: true
	}, function(err, user) {
		if (err) {
			console.log(err);
			res.send(err)
		}
		if (user) {
// USER STUFF HERE
		}
	});
})
router.post('/comment/:name', function(req, res) {
	User.findOneAndUpdate({
		'username': req.params.name,
		"posts.url": req.body.url
	}, {
		$push: {
			"posts.$.comments": req.body.commentbody
		}
	}, {
		safe: true,
		upsert: true,
		new: true
	}, function(err, user) {
		if (err) {
			console.log(err);
			res.send(err)
		}
		if (user) {
			// USER STUFF HERE
		}
	});
})
router.post('/delete/:name', function(req, res) {
	console.log('hi')
	User.findOneAndUpdate({
		'username': req.params.name
	}, {
		$pull: {
			"posts": {url: req.body.url}
		}
	}, {
		safe: true,
		upsert: true,
		new: true
	}, function(err, user) {
		if (err) {
			console.log(err);
			res.send(err)
		}
		if (user) {
			res.send('nice')
		}
	});
})

router.get('/post/new', function(req, res) {
	res.render('index');
});
router.get('/searchusers', function(req, res) {
	res.render('index');
});
router.get('/login', function(req, res) {
	res.render('index');
});
router.get('/hashtag/:id', function(req, res) {
	res.render('hashtag', {tag: req.params.id});
});

module.exports = router;