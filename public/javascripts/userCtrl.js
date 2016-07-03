app.controller('userCtrl', function ($scope, $http, $location, Flash, $rootScope, $window) {
	$rootScope.username = "";
	$scope.signup = function(user) {	
		// signup user
		$http.post('/auth/signup', user).success(function(res) {
			if(res.type == 'danger') {
				Flash.clear();
				$location.path('/signup');
			} else {
				Flash.clear();
				$location.path('/');
			}
			Flash.create(res.type, res.message);
		})
	};
	$scope.login = function(user) {	
		$http.post('/auth/login', user).success(function(res) {
			if(res.type == 'danger') {
				Flash.clear();
				$location.path('/login');
			} else {
				$rootScope.username = res.user.username;
				console.log("name: " + $rootScope.username)
				Flash.clear();
				$window.history.back();
			}
			Flash.create(res.type, res.message);
		})
	}
});
