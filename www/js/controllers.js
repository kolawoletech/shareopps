angular.module('your_app_name.controllers', [])

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function($scope, $ionicConfig) {

})


//LOGIN
.controller('LoginCtrl', function(AuthService, $scope, $state, $templateCache, $q, $rootScope) {
// We create a variable called 'data', we asign it to an empty object and bind it to scope, to handle the form data.
	$scope.data = {};

/**
 * Our function is pretty simple, get the username and password from the form, and send it to our auth service, that's it.
 * The auth service will take care of everything else for you!
 * @return {[type]} [description]
 */
	$scope.loginEmail = function(loginForm){
		if (loginForm.$valid) {
			var email = $scope.data.email;
			var password = $scope.data.password;
			AuthService.loginUser(email, password);
		};
	}



})

.controller('SignupCtrl', function(AuthService, $scope, $state) {
	$scope.data = {};

	$scope.createUser = function(signupForm){
		if (signupForm.$valid) {
			var newEmail = $scope.data.email;
			var newPassword = $scope.data.password;
			var newFullName = $scope.data.fullName;
			var selectedPlan = $state.params.pId;
			AuthService.signupEmail(newEmail, newPassword, newFullName, selectedPlan);
		};

	};
})

.controller('ForgotPasswordCtrl', function($scope, $state) {
	$scope.recoverPassword = function(){
		$state.go('app.feeds-categories');
	};

	$scope.data = {};
})

.controller('ProfileCtrl', function($scope, user, AuthService, $state){
	// Creating an empty object called data and binding it to the $scope.
	$scope.data = {};
		// Creating a userProfile object that will hold the userProfile.userId node
	$scope.userProfile = AuthService.userProfileData(user.uid);

	/**
	 * This function will call our service and log the user out.
	 */
	$scope.logoutUser = function(){
		AuthService.logoutUser();
	};

	/**
	 * This function will get the oldPassword and newPassword values from the form and then pass them
	 * to our changePassword() function inside the auth service.
	 */
	$scope.changePassword = function(changePasswordForm){
	  if (changePasswordForm.$valid) {
	    var oldPassword = $scope.data.oldPassword;
	    var newPassword = $scope.data.newPassword;
	    AuthService.changePassword(user.password.email, oldPassword, newPassword);
	  }
	};

		/**
		 * This will take the user's old email, the new email he wants and the user password and pass it to our
		 * changeEmail() function inside the auth service.
		 *
		 * Then it's going to change the email in our userProfile variable (which points to the userProfile
		 * node in Firebase) and it's going to save that new value.
		 */
	$scope.changeEmail = function(changeEmailForm){
	  if (changeEmailForm.$valid) {
	    AuthService.changeEmail(user.password.email, $scope.data.newEmail, $scope.data.password);
	    $scope.userProfile.email = $scope.data.newEmail;
	    $scope.userProfile.$save();
	  };
	};
})


/*.controller('ChatCtrl', function($scope, $state, $ionicPopup, Messages) {

  $scope.messages = Messages;

  $scope.addMessage = function() {
   $ionicPopup.prompt({
     title: 'Need to get something off your chest?',
     template: 'Let everybody know!'
   }).then(function(res) {
      $scope.messages.$add({
        "message": res
      });
   });
  };
  $scope.logout = function() {
    var ref = new Firebase(firebaseUrl);
    ref.unauth();
    $state.go('login');
  };
})
*/
.controller('SendMailCtrl', function($scope) {
	$scope.sendMail = function(){
		cordova.plugins.email.isAvailable(
			function (isAvailable) {
				// alert('Service is not available') unless isAvailable;
				cordova.plugins.email.open({
					to:      'mail@shareopps.co.za',
					cc:      'admin@shareopps.co.za',
					subject: 'MAIL sent from App User',
					body:    'Yet to Implement'
				});
			}
		);
	};
})

// FEED
//brings all feed categories
/*.controller('FeedsCategoriesCtrl', function($scope, $http) {
	$scope.feeds_categories = [];

	$http.get('feeds-categories.json').success(function(response) {
		$scope.feeds_categories = response;
	});
})
*/
//bring specific category providers


/*//this method brings posts for a source provider
.controller('FeedEntriesCtrl', function($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService) {
	$scope.feed = [];

	var categoryId = $stateParams.categoryId,
			sourceId = $stateParams.sourceId;

	$scope.doRefresh = function() {

		$http.get('feeds-categories.json').success(function(response) {

			$ionicLoading.show({
				template: 'Loading entries...'
			});

			var category = _.find(response, {id: categoryId }),
					source = _.find(category.feed_sources, {id: sourceId });

			$scope.sourceTitle = source.title;

			FeedList.get(source.url)
			.then(function (result) {
				$scope.feed = result.feed;
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
			}, function (reason) {
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
			});
		});
	};

	$scope.doRefresh();

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkFeedPost(post);
	};
})
*/
// SETTINGS
/*.controller('SettingsCtrl', function($scope, $ionicActionSheet, $state) {
	$scope.airplaneMode = true;
	$scope.wifi = false;
	$scope.bluetooth = true;
	$scope.personalHotspot = true;

	$scope.checkOpt1 = true;
	$scope.checkOpt2 = true;
	$scope.checkOpt3 = false;

	$scope.radioChoice = 'B';

	// Triggered on a the logOut button click
	$scope.showLogOutMenu = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			// buttons: [
			// { text: '<b>Share</b> This' },
			// { text: 'Move' }
			// ],
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				//Called when one of the non-destructive buttons is clicked,
				//with the index of the button that was clicked and the button object.
				//Return true to close the action sheet, or false to keep it opened.
				return true;
			},
			destructiveButtonClicked: function(){
				//Called when the destructive button is clicked.
				//Return true to close the action sheet, or false to keep it opened.
				$state.go('auth.walkthrough');
			}
		});

	};
})*/


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

/*.controller('CatsPostsCtrl', function($scope, $http, $stateParams) {
	console.log($stateParams);
	// You can change this url to experiment with other endpoints
	//http://localhost/khaliddev/azkarserv/api/?json=get_category_posts&slug=azkar-for-morning&status=publish
	var postsApi = 'http://shareopps.co.za/app/api/?json=get_category_posts&slug=' + $stateParams.slug + '&status=publish=JSON_CALLBACK';
	$scope.category = $stateParams.category.name;
	// This should go in a service so we can reuse it
	$http.jsonp( postsApi, {cache:true} ).success(function(data, status, headers, config) {
		$scope.posts = data;
		console.log( data );
	}).
	error(function(data, status, headers, config) {
		console.log( 'Post load error.' );
	});
})*/

// WORDPRESS
.controller('WordpressCtrl', function($scope, $http, $ionicLoading, PostService, BookMarkService) {
	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: 'Loading posts...'
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
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};

	$scope.doRefresh();
})


// WORDPRESS POST
.controller('WordpressPostCtrl', function($scope, post_data, $ionicLoading) {

	$scope.post = post_data.post;
	$ionicLoading.hide();

	$scope.sharePost = function(link){
		window.plugins.socialsharing.share('Check this post here: ', null, null, link);
	};
})



/*// WORDPRESS
.controller('CategoryCtrl', function($scope, $http, $ionicLoading, PostService, BookMarkService) {
	$scope.posts = [];
	$scope.category = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: 'Loading ...'
		});

		//Always bring me the latest posts => page=1
		$http.jsonp('http://shareopps.co.za/app/?json=get_category_index' +
		'&callback=JSON_CALLBACK')
		.success(function(data) {
			$scope.category = data.categories;
			$scope.slug = data.slug;
			console.log(data.categories);
			console.log(data.slug);
		})
		.error(function(data) {
			console.log('data.categories');
		})
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getCategoryPosts($scope.page)
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
*/

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
	})
})

.controller('CategoryPostCtrl2', function(WORDPRESS_API_URL, $state,$scope, $stateParams, $http, $ionicLoading, PostService, BookMarkService){
	$http.jsonp(WORDPRESS_API_URL + 'get_category_posts/?slug='+'tech'+'&callback=JSON_CALLBACK')
	.success(function(data) {
		$scope.posts =  data.posts;
		console.log(data.posts);
	})
})
;
