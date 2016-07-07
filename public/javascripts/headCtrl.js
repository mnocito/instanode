app.controller('headCtrl', ['chatSocket', '$scope', '$http', '$location', 'Flash', '$routeParams', '$rootScope', '$mdDialog', 'filepickerService', '$window', '$sce', '$compile', function(chatSocket, $scope, $http, $location, Flash, $routeParams, $rootScope, $mdDialog, filepickerService, $window, $sce, $compile) {
	//auth stuff and inits
	$scope.auth = true;
	$scope.currentPath = ($location.path() === '/login' || $location.path() === '/signup');
	$scope.$on('$routeChangeStart', function(next, current) {
		$scope.currentPath = ($location.path() === '/login' || $location.path() === '/signup');
		$http.get('/authenticated').success(function(res) {
			$scope.username = res.user.username;
			$rootScope.username = $scope.username;
			console.log($scope.username)
			$scope.auth = res.auth;
			if ($scope.auth) {
				if ($location.path() === '/login' || $location.path() === '/signup') {
					$window.location = $window.location.origin;
				}
			} else {
				if ($location.path() != '/login' && $location.path() != '/signup' && $location.path().substring(0, 8) != '/profile' && $window.location.pathname != '/error') {
					$location.path('/login')
				}
			}
			$http.get('/alertnums/' + $scope.username).success(function(res) {
				$scope.alertlikes = res.alertlikes;
				$scope.alertcomments = res.alertcomments;
				$scope.alertmsg = formatAlertMsg();
				if($scope.alertlikes || $scope.alertcomments) {
					setAlert();
				}
				
			})
		});
	});
	$http.get('/authenticated').success(function(res) {
		$scope.auth = res.auth;
		console.log("authenticated: " + $scope.auth)

	});
	// profile config
	$scope.signout = function() {
		console.log('worked')
		$http.get('/signout').then(function(res) {
			console.log($window.location.href.substring(0, 21));
			$window.location = $window.location.href.substring(0, 21);
			Flash.clear();
			Flash.create('success', 'Successfully signed out.')
		});

	}
	$scope.goto = function(location) {
		console.log(location);
		$http.get(location);
	}
	$scope.user = {};
	$scope.profile = function(path) {
		console.log('/profile/' + path);
		$window.location = $window.location.href.substring(0, 21) + '/profile/' + path;
		$http.get('/profile/' + path).success(function(res) {
			console.log(res.name);
		})
	}
	$http.get('/getusers').success(function(res) {
		$scope.users = res.users;
		console.log($scope.users)
	})
	$scope.selectuser = function(user) {
		if (user.username) {
			$window.location = $window.location.origin + '/profile/' + user.username;
		}
	}
	$scope.filterOut = function(users) {
		if ($scope.searchText == undefined) {
			return users;
		}

		function matchtext(user) {
			return user.username.match($scope.searchText)
		}
		for (var i = 0; i < users.length; i++) {
			$scope.users = users.filter(matchtext);
		}
	}

	// redirects
	$scope.tonew = function() {
		$window.location = $window.location.href.substring(0, 21) + '/post/new'
	}
	$scope.tosearch = function() {
		$window.location = $window.location.href.substring(0, 21) + '/searchusers'
	}
	$scope.tologin = function() {
		$window.location = $window.location.href.substring(0, 21);
	}
	$scope.toalerts = function() {
			$window.location = $window.location.origin + "/alerts";
		}
		// chatsockets and alerts
	$scope.showalert = false;

	function setAlert() {
		$scope.showalert = true;
	}
	chatSocket.on('likedreturn', function(data) {
		$http.get('/alertnums/' + $scope.username).success(function(res) {
				$scope.alertlikes = res.alertlikes;
				$scope.alertcomments = res.alertcomments;
				$scope.alertmsg = formatAlertMsg();
				setAlert();
		})
	})
	if ($location.path() == "/" && ($scope.alertlikes || $scope.alertcomments)) {
		setAlert();
		$scope.alertmsg = formatAlertMsg();
	}

	function formatAlertMsg() {
		var ret = 'you have ' + $scope.alertlikes + ' new like';
		if ($scope.alertlikes != 1) {
			ret += 's'
		}
		ret += ' and ' + $scope.alertcomments + ' new comment';
		if ($scope.alertcomments != 1) {
			ret += 's'
		}
		return ret;
	}
}]);