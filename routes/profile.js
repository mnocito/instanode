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
	res.render('error');
})
router.post('/user/:name', function(req, res) {
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
					comments: req.body.comments,
					hashtags: req.body.hashtags
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
			if (err) {}
			if (user) {
				res.send({
					profileurl: user.profileurl,
					bio: req.body.bio
				})
			}
		});
});
router.get('/profile/:id', function(req, res) {
	res.render('profile', {
		name: req.params.id
	});
});
router.post('/unlike/:name', function(req, res) {
	function findpost(post) {
		return post.url === req.body.url;
	}
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
			res.send({
				post: user.posts.find(findpost)
			})
		}
	});
})
router.post('/deletecomment/:name', function(req, res) {
	function findpost(post) {
		return post.url === req.body.url;
	}
	User.findOneAndUpdate({
		'username': req.params.name,
		"posts.url": req.body.url
	}, {
		$pull: {
			"posts.$.comments": {
				createdby: req.body.commenttodelete.createdby,
				body: req.body.commenttodelete.body
			}
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
			res.send({
				post: user.posts.find(findpost)
			})
		}
	});
});

router.post('/delete/:name', function(req, res) {
	console.log('hi')
	User.findOneAndUpdate({
		'username': req.params.name
	}, {
		$pull: {
			"posts": {
				url: req.body.url
			}
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
});
router.get('/profilepic/:name', function(req, res) {
	User.findOne({
			'username': req.params.name
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
					picurl: user.profileurl
				});
			}
		});
})
router.post('/like/:name', function(req, res) {
	function findpost(post) {
		return post.url === req.body.url;
	}
	User.findOneAndUpdate({
		'username': req.params.name,
		"posts.url": req.body.url
	}, {
		$push: {
			"posts.$.likedby": req.body.name,
			"alerts": {
				type: "like",
				viewed: false,
				liker: req.body.name,
				posturl: req.body.url,
				profileurl: req.user.profileurl
			}
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
			var post = user.posts.find(findpost);
			console.log(post.url)
			res.send({
				post: user.posts.find(findpost)
			})
		}
	});
})

router.post('/comment/:name', function(req, res) {
	function findpost(post) {
		return post.url === req.body.url;
	}
	var pic = "";
	User.findOneAndUpdate({
		'username': req.params.name,
		"posts.url": req.body.url
	}, {
		$push: {
			"posts.$.comments": req.body.commentbody,
			"alerts": {
				type: "comment",
				viewed: false,
				commenter: req.body.commentbody.createdby,
				comment: req.body.commentbody.body,
				posturl: req.body.url,
				profileurl: req.user.profileurl
			}
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
			res.send({
				post: user.posts.find(findpost)
			})
		}
	});
})
router.get('/alertnums/:name', function(req, res) {
	User.findOne({
		username: req.params.name
	}, function(err, user) {
		var likecount = 0;
		var commentcount = 0;
		for (var i in user.alerts) {
			if (!user.alerts[i].viewed) {
				if (user.alerts[i].type == 'like') {
					likecount++;
				} else if (user.alerts[i].type == 'comment') {
					commentcount++;
				}
			}
		}
		res.send({
			alertlikes: likecount,
			alertcomments: commentcount
		})
	})
})
router.get('/alerts/:name', function(req, res) {
	User.findOne({
		username: req.params.name
	}, function(err, user) {
		res.send({
			alerts: user.alerts
		});
	})
	var unviewedalerts = 0;
	for (var i = 0; i < req.user.alerts; i++) {
		if (!req.user.alerts[i].viewed) {
			unviewedalerts++;
		}
	}
	User.findOne({
		username: req.params.name,
	}, function(err, user) {
		for (var i = 0; i < user.alerts.length; i++) {
			if (!user.alerts[i].viewed) {
				user.alerts[i].viewed = true;
			}
		}
		user.update(user, function(err, user) {})
	})


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
	res.render('hashtag', {
		tag: req.params.id
	});
});
router.get('/alerts', function(req, res) {
	res.render('index');
});
module.exports = router;