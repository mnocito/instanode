var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
require('../models/user');
var User = mongoose.model('User');
var http = require('http').Server(app);
var io = require('socket.io')(http);

router.post('/follow/:name', function(req, res) {
	User.findOneAndUpdate({
		'username': req.params.name
	}, {
		$push: {
			"followers": req.body.name
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
			res.send({followers: user.followers})
		}
	});
	User.findOneAndUpdate({
		'username': req.body.name
	}, {
		$push: {
			"following": req.params.name
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
		}
	});
});
router.post('/unfollow/:name', function(req, res) {
	User.findOneAndUpdate({
		'username': req.params.name
	}, {
		$pull: {
			"followers": req.body.name
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

		}
	});
	User.findOneAndUpdate({
		'username': req.body.name
	}, {
		$pull: {
			"following": req.params.name
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
			res.send({followers: user.followers})
		}
	});
});
var posts = [];
router.get('/getposts/:name', function(req, res) {
	User.findOne({'username': req.params.name}, function(err, user) {
		if(err) {
			console.log(err)
		}
		if(user) {
			for(var i = 0; i < user.following.length; i++) {
				User.findOne({'username': user.following[i]}, function(err, user) {
				if(user.posts[0]) {
					for(var j = 0; j < user.posts.length; j++) {
						if(user.profileurl) {
							user.posts[j].creatorpic = user.profileurl;
						}
						user.posts[j].date = formatDate(new Date(), new Date(user.posts[j].date).getTime());
						posts.push(user.posts[j])
					}
				}
				})
			}
			console.log(posts)
			res.send({posts: posts});
			posts = [];
		}
	})
});
    // internal funcs
  var formatDate = function(date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds
    var date1_ms = new Date(date2).getTime();
    var date2_ms = date1.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);
    if (days >= 1) {
      return days + "d ago"
    }
    if (hours >= 1) {
      return hours + "h ago"
    }
    if (minutes >= 1) {
      return minutes + "m ago"
    }
    if (seconds >= 1) {
      return seconds + "s ago"
    }
    if (difference_ms >= 1) {
      return "Just now"
    }
    return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds ago';
  }
module.exports = router;