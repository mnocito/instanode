var app = angular.module('instagram', ['ngMaterial', 'ngRoute', 'angular-filepicker', 'ngFlash', 'btford.socket-io']);
app.config(function($routeProvider, $locationProvider, filepickerProvider) {
	filepickerProvider.setKey("AgDOdGLchTGCbHKEe4cZyz");
	$locationProvider.html5Mode(true);
	$routeProvider
		.when('/', {
			templateUrl: "/partials/index.html",
			controller: "postCtrl"
		})
		.when('/login', {
			templateUrl: '/partials/login.html',
			controller: "userCtrl"
		})
		.when('/signup', {
			templateUrl: '/partials/signup.html',
			controller: "userCtrl"
		})
		.when('/post/new', {
			templateUrl: "/partials/new.html",
			controller: "newPostCtrl"
		})
		.when('/profile/:name', {
			templateUrl: "/partials/profile.html",
			controller: "profileCtrl"
		})
		.when('/searchusers', {
			templateUrl: "/partials/searchusers.html",
			controller: "searchCtrl"
		})
		.when('/hashtag/:tag', {
			templateUrl: "/partials/searchusers.html",
			controller: "hashtagCtrl"
		})
		.otherwise({
			redirectTo: "/"
		})
});
/*
TODO:
Profiles
	- have a follower, following, and requested param
		- make each of these in both users? like people user1 has requested and people that have requested user1
	- (button at top) add search function for each user 
	- (button at top) add alerts when somebody likes your photo-- store this in an alerts param for the user? ex. if user1 likes user2's photo, find user2 in the database and push
																				"User1 has liked your photo!" into their alerts array?
	- add see requested? Or should that be a separate part of alerts?

*/