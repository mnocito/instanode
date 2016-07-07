var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/user');
var User = mongoose.model('User');
module.exports = function(io) {
	io.sockets.on('connection', function(socket) {
		socket.on('liked', function(data) {
			socket.broadcast.emit('likedreturn', {liker: data.liker, likee: data.likee})
		})
		console.log('client connect');
	});
	return router;
}