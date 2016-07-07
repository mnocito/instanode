var mongoose = require('mongoose');
 
var userSchema = mongoose.Schema({
	username: String,
	password: String,
	bio: String,
	profileurl: String,
	posts: {type: Array, default: []},
	following: {type: Array, default: []},
	followers: {type: Array, default: []},
	requestedby: {type: Array, default: []},
	requestedto: {type: Array, default: []},
	alerts: {type: Array, default: []}
});

mongoose.model('User', userSchema);