app.controller('searchCtrl', ['$scope', '$http', '$location', 'Flash', '$window', function ($scope, $http, $location, Flash, $window) {
	$http.get('/getusers').success(function(res) {
		$scope.users = res.users;
		console.log($scope.users)
	})
	$scope.selectuser = function(user) {
		$window.location = $window.location.origin + '/profile/' + user.username;
	}
	$scope.filterOut = function(users) {
		if($scope.searchText == undefined) {
			return users;
		}
		function matchtext(user) {
			return user.username.match($scope.searchText)
		}
		for(var i = 0; i < users.length; i++) {
			return users.filter(matchtext);
		}
	}
}]);
