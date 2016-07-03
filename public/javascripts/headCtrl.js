app.controller('headCtrl', function($scope, $http, $location, Flash, $rootScope, $window) {
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
					$location.path('/');
				}
			} else {
				if ($location.path() != '/login' && $location.path() != '/signup' && $location.path().substring(0, 8) != '/profile' && $window.location.pathname != '/error') {
					$location.path('/login')
				}
			}
		});
	});
	$http.get('/authenticated').success(function(res) {
		$scope.auth = res.auth;
		console.log("authenticated: " + $scope.auth)

	});
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
	$scope.tonew = function() {
		$window.location = $window.location.href.substring(0, 21) + '/post/new'
	}
	$scope.tosearch = function() {
		$window.location = $window.location.href.substring(0, 21) + '/searchusers'
	}
	$scope.tologin = function() {
		$window.location = $window.location.href.substring(0, 21);
	}
});