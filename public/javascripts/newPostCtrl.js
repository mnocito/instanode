app.controller('newPostCtrl', function ($scope, $http, $location, filepickerService, Flash, $rootScope, $sce) {
     console.log($scope.username)
     $scope.upload = function(){
      filepickerService.pick(
          {
            mimetype: 'image/*',
            language: 'en',
            services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
          },
          function(Blob){
             console.log(Blob);
             $scope.newUrl = Blob.url;
          }
      );
     };  
     $scope.add = function(post = {caption: '', location: '', comments: [], likedby: [], profileUrl: ''}) {
      // add check and throw alert if newUrl is blank
      if($scope.newUrl == undefined) {
        Flash.create('danger', 'You must upload an image with your post.')
        return;
      }
      post.createdby = $rootScope.username;
      post.date = new Date();
      post.url = $scope.newUrl;
      post.likedby = [];
      post.comments = [];
      if(!post.caption) {
        post.caption = '';
      }
      if(post.caption) {
        post.hashtags = post.caption.match(/#\S+/g);
      }
      if(!post.location) {
        post.location = '';
      }
      $http.post('/user/' + $rootScope.username, post).success(function(res) {
          Flash.create(res.type, res.message);
      });      
     
      $location.path("/");
     }
});