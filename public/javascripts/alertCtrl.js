app.controller('alertCtrl', function($scope, $http, $location, filepickerService, Flash, $rootScope, $sce, $mdDialog) {
  $http.get('/authenticated').success(function(res) {
    $scope.user = res.user;
    $scope.username = res.user.username;
    $http.get('/alerts/' + $scope.username).success(function(res) {
      $scope.alerts = res.alerts;
    })
  });
  $scope.topost = function(ev, url) {
    console.log(url)
    for (var i in $scope.user.posts) {
      if ($scope.user.posts[i].url == url) {
        var post = $scope.user.posts[i];
      }
    }
    $scope.post = post;
    if (!$scope.post.setasHTML) {
      $scope.post.caption = $sce.trustAsHtml($scope.post.caption);
      $scope.post.setasHTML = true;
    }
    if (!post.dated) {
      post.date = formatDate(new Date(), post.date);
      post.dated = true;
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
  }
  $scope.gotoprofile = function(name) {
    $window.location = $window.location.origin + '/profile/' + name;
  }
  $scope.deletecomment = function(post, comment) {
    post.commenttodelete = comment;
    $http.post('/deletecomment/' + post.createdby, post).success(function(res) {
      $scope.post.comments = res.post.comments;
    })
  }
  $scope.delete = function(post) {
    $http.post('/delete/' + $scope.name, post).success(function(res) {
      console.log('post deleted');
    })
  }
  $scope.like = function(post, ev) {
    post.name = $scope.username;
    $http.post('/like/' + $scope.name, post).success(function(res) {
      console.log("liked")
      $scope.post.likedby = res.post.likedby;
    })
  }
  $scope.unlike = function(post, ev) {
    post.name = $scope.username;
    $http.post('/unlike/' + $scope.name, post).success(function(res) {
      console.log("unliked")
      $scope.post.likedby = res.post.likedby;
    })
  }
  $scope.add = function(post, commentbody) {
    console.log($scope.user.posts.indexOf(post))
    post.commentbody = {
      createdby: $scope.username,
      body: commentbody
    }
    $http.post('/comment/' + $scope.name, post).success(function(res) {
      $scope.user.posts[$scope.user.posts.indexOf(post)] = res.post;
      $scope.commentbody = "";
      $scope.post.comments = res.post.comments;
    })
  }
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
});