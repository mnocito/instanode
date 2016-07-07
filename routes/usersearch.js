var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
require('../models/user');
var User = mongoose.model('User');
router.get('/getusers', function(req, res) {
	User.find({}, function(err, users) {
		res.send({users: users});
	});
});
module.exports = router;