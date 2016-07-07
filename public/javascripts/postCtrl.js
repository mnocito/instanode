app.controller('postCtrl', ['chatSocket', '$scope', '$http', '$location', 'Flash', '$routeParams', 'filepickerService', '$window', function(chatSocket, $scope, $http, $location, Flash, $routeParams, filepickerService, $window) {
    chatSocket.on('likedreturn', function(data) {
      console.log(data.liker + ' liked ' + data.likee + "'s post")
    })
  $scope.posts = [];
  $http.get('/authenticated').success(function(res) {
    if (!res.auth) $location.path('/login')
    console.log(res.user.username)
  $scope.username = res.user.username;
    $http.get('/getposts/' + res.user.username).success(function(res) {
      $scope.posts = res.posts;
      console.log(res.posts)
    })
  });
  $scope.commentbody = '';
  if (window.location.pathname == '/newpost') {
    $location.path('/post/new')
  }
    if (window.location.pathname == '/alerts') {
    $location.path('/alerts')
  }
  if (window.location.pathname == '/usersearch') {
    $location.path('/searchusers')
  }
  $scope.add = function(post, text) {
  }
  $scope.upload = function() {
    filepickerService.pick({
        mimetype: 'image/*',
        language: 'en',
        services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'IMAGE_SEARCH'
      },
      function(Blob) {
        console.log(Blob);
        $scope.newUrl = Blob.url;
      }
    );
  };
  $scope.liked = false;
    // mentions and hashtags
  $scope.tagUserClick = function(e) {
    var tagText = e.target.innerText;
    $window.location = $window.location.origin + "/profile/" + tagText.substring(1, tagText.length);
  };

  $scope.tagTermClick = function(e) {
    var tagText = e.target.innerText;
    $window.location = $window.location.origin + "/hashtag/" + tagText.substring(1, tagText.length);
  };
  // post funcs
  $scope.like = function(post) {
    chatSocket.emit('liked', {
      liker: $scope.username,
      likee: post.createdby
    })
    post.name = $scope.username;
    $http.post('/like/' + post.createdby, post).success(function(res) {
      $scope.posts[$scope.posts.indexOf(post)].likedby = res.post.likedby;
    })
  }
  $scope.unlike = function(post) {
    post.name = $scope.username;
    $http.post('/unlike/' + post.createdby, post).success(function(res) {
      $scope.posts[$scope.posts.indexOf(post)].likedby = res.post.likedby;
    })
  }
  $scope.add = function(post) {
    post.commentbody = {
      createdby: $scope.username,
      body: post.commentbody
    }
    $http.post('/comment/' + post.createdby, post).success(function(res) {
      $scope.posts[$scope.posts.indexOf(post)].comments = res.post.comments;
      post.commentbody = "";
    })
  }
  $scope.toprofile = function(name) {
    $window.location = $window.location.origin + "/profile/" + name;
  }
  $scope.deletecomment = function(post, comment) {
    post.commenttodelete = comment;
    $http.post('/deletecomment/' + post.createdby, post).success(function(res) {
        $scope.posts[$scope.posts.indexOf(post)].comments = res.post.comments;
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

  $scope.try = function() {
    chatSocket.emit('test', {meme: "testes"});
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