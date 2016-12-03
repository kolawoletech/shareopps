angular.module('sopps.controllers', [])

.controller('AuthCtrl', function($scope, $state, $ionicConfig, AuthService) {

})

.controller('AppCtrl', function($scope, $ionicConfig) {

})

.controller('LogInCtrl', function($scope, $state, AuthService, $ionicLoading) {
  $scope.login = function(user){
    $ionicLoading.show({
      template: 'Logging in ...'
    });

    AuthService.doLogin(user)
    .then(function(user){
      // success
      $state.go('app.user');
      $ionicLoading.hide();
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };

  $scope.facebookLogin = function(){
    $ionicLoading.show({
      template: 'Logging in with Facebook ...'
    });

    AuthService.doFacebookLogin()
    .then(function(user){
      // success
      $state.go('app.user');
      $ionicLoading.hide();
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
})

.controller('SignUpCtrl', function($scope, $state, AuthService, $ionicLoading) {
  $scope.signup = function(user){
    $ionicLoading.show({
      template: 'Signing up ...'
    });

    AuthService.doSignup(user)
    .then(function(user){
      // success
      $state.go('app.user');
      $ionicLoading.hide();
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
})

.controller('UserCtrl', function($scope, $state, AuthService){
  $scope.current_user = {};

  var current_user = AuthService.getUser();

  if(current_user && current_user.provider == "facebook"){
    $scope.current_user.email = current_user.facebook.displayName;
    $scope.current_user.image = current_user.facebook.profileImageURL;
  } else {
    $scope.current_user.email = current_user.password.email;
    $scope.current_user.image = current_user.password.profileImageURL;
  }

  $scope.logout = function(){
    AuthService.doLogout();

    $state.go('auth.login');
  };
})

.controller('SendMailCtrl', function($scope) {
	$scope.sendMail = function(){
		cordova.plugins.email.isAvailable(
			function (isAvailable) {
				// alert('Service is not available') unless isAvailable;
				cordova.plugins.email.open({
					to:      'mail@shareopps.co.za',
					cc:      'admin@shareopps.co.za',
					subject: 'MAIL sent from App User',
					body:    'Write Feedback'
				});
			}
		);
	};
})



// BOOKMARKS
.controller('BookMarksCtrl', function($scope, $rootScope, BookMarkService, $state) {

	$scope.bookmarks = BookMarkService.getBookmarks();

	// When a new post is bookmarked, we should update bookmarks list
	$rootScope.$on("new-bookmark", function(event){
		$scope.bookmarks = BookMarkService.getBookmarks();
	});

	$scope.goToFeedPost = function(link){
		window.open(link, '_blank', 'location=yes');
	};
	$scope.goToWordpressPost = function(postId){
		$state.go('app.post', {postId: postId});
	};


})

// WORDPRESS
.controller('MyOpportunityCtrl', function($scope,$ionicPopup, $http, $ionicLoading, PostService, BookMarkService) {
	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;



	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: 'Loading Opportunities...'
		});

		//Always bring me the latest posts => page=1
		PostService.getRecentPosts(1)
		.then(function(data){
			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);
			$scope.categories = [];
			angular.forEach(data.posts, function(post, index) {
	        	angular.forEach(post.categories, function(category, index){
       				 $scope.categories.push(category);
      			});
	    	});

			
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
			console.log(data);
			console.log(data.posts);

		});
	};



	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getRecentPosts($scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};


	$scope.doRefresh();
})
// WORDPRESS
.controller('WordpressCtrl', function(WORDPRESS_API_URL, $scope, $http, $ionicLoading, PostService, BookMarkService) {
	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: 'Loading Opportunities...'
		});

		//Always bring me the latest posts => page=1
		PostService.getRecentPosts(1)
		.then(function(data){
			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);

			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getRecentPosts($scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};




	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Opportunity Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};

	$scope.doRefresh();
})


// WORDPRESS POST
.controller('WordpressPostCtrl', function($scope, $cordovaCalendar, post_data, $ionicLoading,BookMarkService, $ionicPopup,$cordovaSocialSharing,  $cordovaLocalNotification) {

	$scope.post = post_data.post;
	$ionicLoading.hide();

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Opportunity Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};

	$scope.sharePost = function(link){
		window.plugins.socialsharing.share('Check this student opportunity here: ', null, null, link);
	};



    $scope.createEvent = function() {

	  $cordovaCalendar.createEventInteractively({
	    title: 'Set Title',
	    location: 'Set Location',
	    notes: 'ShareOpps Opportunities',
	    startDate: new Date(2016, 0, 6, 18, 30, 0, 0, 0),
	    endDate: new Date(2016, 1, 6, 12, 0, 0, 0, 0)
	  }).then(function (result) {
	    // success
	    console.log("Opportunity Reminder created successfully");
	  }, function (err) {
	    // error
	    console.error("There was an error: " + err);
	  });
    };



})


// WORDPRESS
.controller('WordpressCtrl2', function($state,$scope, $stateParams, $http, $ionicLoading, PostService, BookMarkService) {
	$scope.category = [];
	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;
	var slug = $stateParams.slug;
	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: 'Loading Categories...'
		});

		//Always bring me the latest posts => page=1
		PostService.getCategoryPosts(1)
		.then(function(data){
			$scope.totalPages = data.pages;
			$scope.category = data.categories;
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');

		});
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getCategoryPosts($scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.category = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};

	$scope.doRefresh();
})

.controller('CategoryPostCtrl', function(WORDPRESS_API_URL, $state,$scope, $stateParams, $http, $ionicLoading, PostService, BookMarkService){
	$http.jsonp(WORDPRESS_API_URL + 'get_category_posts/?slug='+$stateParams.slug+'&callback=JSON_CALLBACK')
	.success(function(data) {
		$scope.posts =  data.posts;
		console.log(data.posts);
	});
})

.controller('SubmitCtrl', function(WORDPRESS_API_URL, $state,$scope, $stateParams, $http, $ionicLoading, PostService, BookMarkService){
	$scope.sendFeedback= function() {
        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "Opportunity Submitted For Review", // Subject
            "",                      // Body
            ["admin@shareopps.co.za"],    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
    };

/*
	$scope.createPost = function() {
 		var createPostDraft;
		$http.jsonp(WORDPRESS_API_URL + '/get_nonce/?controller=posts&method=create_post' +
		'&callback=JSON_CALLBACK')
		.success(function(data) {
			console.log(data.nonce);
			 createPostDraft = $http.jsonp(WORDPRESS_API_URL + '/posts/create_post/?nonce='+data.nonce+'&title=NewPostUser&status=draft'+'&callback=JSON_CALLBACK');

		}, function(){
			console.log(data.nonce);
		});
		$http.jsonp(WORDPRESS_API_URL + '/get_nonce/?controller=posts&method=create_post' +
		'&callback=JSON_CALLBACK')
          .then(function(result) {
           
            console.log(result);
            console.log(result.nonce);

            // make the next call
            return $http.jsonp(WORDPRESS_API_URL + '/posts/create_post/?nonce='+result.nonce+'&title=NewPostUser&status=draft'+'&callback=JSON_CALLBACK').toString();
          }).then(function (result) {
            // result of last call available here
             console.log("Yes");
             $http.jsonp(WORDPRESS_API_URL + '/posts/create_post/?nonce='+result.nonce+'&title=NewPostUser&status=draft'+'&callback=JSON_CALLBACK');
          });

	}; */
})

;