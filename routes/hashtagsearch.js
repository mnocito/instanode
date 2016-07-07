var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
require('../models/user');
var User = mongoose.model('User');
router.get('/hashtagfind/:tag', function(req, res) {
	console.log('aggregation nation')
	User.find({}, function(err, users) {
		var posts = []
		for (var i in users) {
			for (var j in users[i].posts) {
				if (users[i].posts[j].hashtags != undefined) {
					for(var k in users[i].posts[j].hashtags) {
						if(users[i].posts[j].hashtags[k] == ('#' + req.params.tag))
						posts.push(users[i].posts[j]);
					}
				}
			}
		}
		res.send({posts: posts});
	});
});
module.exports = router;