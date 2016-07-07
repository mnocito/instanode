app.controller('profileCtrl', ['chatSocket', '$scope', '$http', '$location', 'Flash', '$routeParams', '$rootScope', '$mdDialog', 'filepickerService', '$window', '$sce', '$compile', function(chatSocket, $scope, $http, $location, Flash, $routeParams, $rootScope, $mdDialog, filepickerService, $window, $sce, $compile) {
  //chatsockets
  $scope.$on('$routeChangeStart', function(next, current) {
    if ($location.path().substring(0, 8) == '/hashtag') {
      $window.location = $window.location.origin + $location.path();
    }
  });
  $scope.messages = []
  $scope.edit = false;
  $scope.name = name;
  $scope.isediting = false;
  $http.get('/user/' + name).success(function(res) {
    if (res.user == 'error') {
      $window.location = $window.location.origin + '/error'
    }
    $http.get('/authenticated').success(function(res) {
      $scope.auth = res.auth;
      if (res.user.username) {
        $scope.username = res.user.username;
      }
    })
    if (res.user) {
      console.log(res.user);
      $scope.user = res.user;
    } else {
      Flash.create(res.type, res.message);
    }
  })
  $scope.show = function(ev, post) {
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
  };
  // add follow command to follow people
  // add checkfollowing to see if they're following this person or not
  $scope.edit = function() {
    $scope.isediting = true;
  }
  $scope.uploadprofilepic = function() {
    filepickerService.pick({
        mimetype: 'image/*',
        language: 'en',
        services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'IMAGE_SEARCH'
      },
      function(Blob) {
        console.log(Blob);
        $scope.profileurl = Blob.url;
      }
    );
  };
  $scope.update = function(edituser) {
    edituser.url = $scope.profileurl;
    $http.post('/updateuser/' + $scope.user.username, edituser).success(function(res) {
      $scope.user.profileurl = res.profileurl;
      $scope.user.bio = res.bio;
      console.log('user has been updated')
      Flash.create(res.type, res.message);
      $scope.isediting = false;
      $window.location = $window.location.href;
    });
  }
  $scope.like = function(post, ev) {
    post.name = $scope.username;
    $http.post('/like/' + $scope.name, post).success(function(res) {
      console.log("liked")
      $scope.user.posts[$scope.user.posts.indexOf(post)] = res.post;
      $scope.post.likedby = res.post.likedby;
    })
  }
  $scope.unlike = function(post, ev) {
    post.name = $scope.username;
    $http.post('/unlike/' + $scope.name, post).success(function(res) {
      console.log("unliked")
      $scope.user.posts[$scope.user.posts.indexOf(post)] = res.post;
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
  $scope.delete = function(post) {
    $http.post('/delete/' + $scope.name, post).success(function(res) {
      console.log('post deleted');
    })
  }

  // mentions and hashtags
  $scope.tagUserClick = function(e) {
    var tagText = e.target.innerText;
    $window.location = $window.location.origin + "/profile/" + tagText.substring(1, tagText.length);
  };

  $scope.tagTermClick = function(e) {
    var tagText = e.target.innerText;
    $window.location = $window.location.origin + "/hashtag/" + tagText.substring(1, tagText.length);
  };

  // following + unfollowing
  $scope.following = function(username) {
    return $scope.user.followers.includes($scope.username);
  }
  $scope.follow = function() {
    console.log($scope.username)
    $http.post('/follow/' + $scope.name, {name: $scope.username}).success(function(res) {
      $scope.user.followers = res.followers
      console.log(res.followers)
    })
  }
  $scope.unfollow = function() {
    console.log($scope.username)
    $http.post('/unfollow/' + $scope.name, {name: $scope.username}).success(function(res) {
      console.log(res.followers)
      $scope.user.followers = res.followers
    })
  }
  $scope.gotoprofile = function(name) {
    $window.location = $window.location.origin + '/profile/' + name;
  }
  $scope.deletecomment = function(post, comment) {
    var ind = $scope.user.posts.indexOf(post);
    post.commenttodelete = comment;
    $http.post('/deletecomment/' + post.createdby, post).success(function(res) {
        $scope.user.posts[ind].comments = res.post.comments;
    })
  }
  // internal funcs
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