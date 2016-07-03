var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
require('../models/user');
var User = mongoose.model('User');
var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
module.exports = function(passport) {
	passport.use('signup', new LocalStrategy({
		passReqtoCallback: true
	},
	function(username, password, done) {
			
			User.findOne({'username': username}, function(err, user) {
				if(err) {
					console.log("error in signing up: " + err);
					return done(err);
				}
				// if user exists
				if(user) {
					return done(null, false, {message: "User already exists", type: "warning"});
				} else {
					var newUser = new User();
					newUser.username = username;
					newUser.password = createHash(password);
					newUser.save(function(err) {
						if(err) {
							console.log("error in saving user: " + err);
							throw err;
						}
						return done(null, newUser, {message: "User created successfully", type: "success"});
					});
				}
			});
	})
);
};