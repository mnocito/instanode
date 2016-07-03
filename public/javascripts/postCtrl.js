app.controller('postCtrl', ['chatSocket', '$scope', '$http', '$location', 'Flash', '$routeParams', 'filepickerService', function(chatSocket, $scope, $http, $location, Flash, $routeParams, filepickerService) {
  $http.get('/authenticated').success(function(res) {
    if (!res.auth) $location.path('/login')
  });
  $scope.commentbody = '';
  if (window.location.pathname == '/newpost') {
    $location.path('/post/new')
  }
  if (window.location.pathname == '/usersearch') {
    $location.path('/searchusers')
  }
  $scope.add = function(post, text) {
    console.log(text);
    console.log($scope.posts.indexOf(post));
    $scope.posts[$scope.posts.indexOf(post)].comments.push({
      createdby: "Jackie Chan",
      body: text
    });
    console.log($scope.commentbody);
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
  $scope.like = function(post) {
    if (!$scope.liked) {
      $scope.posts[$scope.posts.indexOf(post)].likedby.push("Jackie Chan");
    } else {
      $scope.posts[$scope.posts.indexOf(post)].likedby.pop("Jackie Chan");
    }
    $scope.liked = !$scope.liked;
  }
}]);