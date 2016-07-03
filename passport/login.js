var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
require('../models/user');
var User = mongoose.model('User');
var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}
module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
		passReqtoCallback: true
	},
	function(username, password, done) {
		// check if user exists
		User.findOne({'username': username},
			function(err, user) {
				if(err) {
					console.log(err);
					return done(err);
				}
				if(!user) {
					return done(null, false, {message: 'User not found', type: 'warning'});
				} 
				if (!isValidPassword(user, password)){
          			console.log('Invalid Password');
          			return done(null, false, {message: 'Wrong password', type: 'warning'});
          		}
          		return done(null, user);
			})
	}
));
};