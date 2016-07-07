app.controller('hashtagCtrl', ['$scope', '$routeParams', '$window', '$http', '$mdDialog', '$sce', '$location', function($scope, $routeParams, $window, $http, $mdDialog, $sce, $location) {
	$http.get('/hashtagfind/' + tag).success(function(res) {
		$scope.posts = res.posts;
	})
	$http.get('/authenticated').success(function(res) {
		$scope.auth = res.auth;
		if (res.user.username) {
			$scope.username = res.user.username;
		}
	})
	$scope.show = function(ev, post) {
		$http.get('/profilepic/' + post.createdby).success(function(res) {
			post.creatorpic = res.picurl;
			if (!post.dated) {
				post.date = formatDate(new Date(), post.date);
				post.dated = true;
			}
			$scope.post = post;
			if (!$scope.post.setasHTML) {
				$scope.post.caption = $sce.trustAsHtml($scope.post.caption);
				$scope.post.setasHTML = true;
			}
			$mdDialog.show({
				clickOutsideToClose: true,
				scope: $scope,
				preserveScope: true,
				templateUrl: "/partials/cardtemplate.html",
				targetEvent: ev,
				hasBackdrop: false,
				bindToController: true,
				controller: function DialogController($scope, $mdDialog) {
					$scope.closeDialog = function() {
						$mdDialog.hide();
					}
				}
			});
		})

	};
	$scope.like = function(post) {
		post.name = $scope.username;
		$http.post('/like/' + post.createdby, post).success(function(res) {
			console.log("post: " + res.retpost)
			$scope.posts[$scope.posts.indexOf(post)] = res.post;
			$scope.post.likedby = res.post.likedby;
		})
	}
	$scope.unlike = function(post) {
		post.name = $scope.username;
		$http.post('/unlike/' + post.createdby, post).success(function(res) {
			$scope.posts[$scope.posts.indexOf(post)] = res.post;
			$scope.post.likedby = res.post.likedby;
		})
	}
	$scope.add = function(post, commentbody) {
		post.commentbody = {
			createdby: $scope.username,
			body: commentbody
		}
		$http.post('/comment/' + post.createdby, post).success(function(res) {
			$scope.posts[$scope.posts.indexOf(post)] = res.post;
			$scope.commentbody = "";
			$scope.post.comments = res.post.comments;
		})
	}
	$scope.tagUserClick = function(e) {
		var tagText = e.target.innerText;
		$window.location = $window.location.origin + "/profile/" + tagText.substring(1, tagText.length);
	};

	$scope.tagTermClick = function(e) {
		var tagText = e.target.innerText;
		$window.location = $window.location.origin + "/hashtag/" + tagText.substring(1, tagText.length);
	};
	$scope.gotoprofile = function(name) {
			$window.location = $window.location.origin + '/profile/' + name;
		}
		// internal
	var formatDate = function(date1, date2) {
		//Get 1 day in milliseconds
		var one_day = 1000 * 60 * 60 * 24;
		// Convert both dates to milliseconds
		var date1_ms = new Date(date2).getTime();
		var date2_ms = date1.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = date2_ms - date1_ms;
		difference_ms = difference_ms / 1000;
		var seconds = Math.floor(difference_ms % 60);
		difference_ms = difference_ms / 60;
		var minutes = Math.floor(difference_ms % 60);
		difference_ms = difference_ms / 60;
		var hours = Math.floor(difference_ms % 24);
		var days = Math.floor(difference_ms / 24);
		if (days >= 1) {
			return days + "d ago"
		}
		if (hours >= 1) {
			return hours + "h ago"
		}
		if (minutes >= 1) {
			return minutes + "m ago"
		}
		if (seconds >= 1) {
			return seconds + "s ago"
		}
		if (difference_ms >= 1) {
			return "Just now"
		}
		return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds ago';
	}
}]);