angular.module('your_app_name.controllers', [])

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function($scope, $ionicConfig) {

})


//LOGIN
.controller('LoginCtrl', function(Auth, AuthService, $scope, $state, $templateCache, $q, $rootScope) {
// We create a variable called 'data', we asign it to an empty object and bind it to scope, to handle the form data.
	$scope.data = {};

/**
**https://sopps.firebaseio.com/
 * Our function is pretty simple, get the username and password from the form, and send it to our auth service, that's it.
 * The auth service will take care of everything else for you!
 * @return {[type]} [description]
 */
	$scope.loginEmail = function(loginForm){
		if (loginForm.$valid) {
			var email = $scope.data.email;
			var password = $scope.data.password;
			AuthService.loginUser(email, password);
		}
	};
	$scope.loginWithGoogle = function loginWithGoogle() {
	    Auth.$authWithOAuthPopup('google')
	      .then(function(authData) {
	        $state.go('app.wordpress');
	    });
  	};

	$scope.loginWithTwitter = function loginWithFacebook() {
	    Auth.$authWithOAuthPopup('twitter')
	      .then(function(authData) {
	        $state.go('app.wordpress');
	    });
  	};

})

.controller('SignupCtrl', function(AuthService, Auth, $scope, $state) {
	$scope.data = {};
  var firebaseUrl = "https://sopps.firebaseio.com/";

  var usersRef = new Firebase(firebaseUrl+'/userProfile');

	$scope.createUser = function(signupForm){
		if (signupForm.$valid) {
			var newEmail = $scope.data.email;
			var newPassword = $scope.data.password;
			var newFullName = $scope.data.fullName;
			var selectedPlan = $state.params.pId;
			AuthService.signupEmail(newEmail, newPassword, newFullName, selectedPlan);
		}

	};
	$scope.signupWithGoogle = function() {
	    Auth.$authWithOAuthPopup('google')
	      .then(function(authData) {
	        $state.go('app.profile');
	    });
  	};
	$scope.signupWithFacebook = function() {
	    Auth.$authWithOAuthPopup('facebook')
	      .then(function(authData) {
	        $state.go('app.profile');
	    });
  	};
  	$scope.Facebook = function(){
      Auth.$authWithOAuthPopup('facebook')
      .then(function(authData) {
       usersRef.child(authData.uid).set({
        provider: authData.provider,
        name: authData.facebook.displayName
        }).then(function(authData) {
	        $state.go('app.profile');
	    }).catch(function(error){
          console.log(error);
        });
      });
    };
  	$scope.Twitter = function(){
      Auth.$authWithOAuthPopup('twitter')
      .then(function(authData) {
       usersRef.child(authData.uid).set({
        provider: authData.provider,
        name: authData.twitter.displayName
        })
       .then(function(error){
         $state.go('app.profile');
        });
      });
    };
  	$scope.Google = function(){
      Auth.$authWithOAuthPopup('google')
      .then(function(authData) {
       usersRef.child(authData.uid).set({
        provider: authData.provider,
        name: authData.google.displayName
        }).then(function(error){
           $state.go('app.profile');
        });
      });
    };

 
})

.controller('ForgotPasswordCtrl', function($scope, $state) {
	$scope.recoverPassword = function(){
		$state.go('app.feeds-categories');
	};

	$scope.data = {};
})

.controller('ProfileCtrl', function($firebaseRef, $scope, user, AuthService, $state, $ionicPopup, $firebaseObject){
	// Creating an empty object called data and binding it to the $scope.
	$scope.data = {};
		// Creating a userProfile object that will hold the userProfile.userId node
	$scope.userProfile = AuthService.userProfileData(user.uid);
	$scope.updateProfile =   function(){
	    $ionicPopup.prompt({
	     title: '<input type="text" ng-model="userProfile.institution" >',
	     template: 'Enter Institution!',
	     scope: $scope
	    }).then(function(authData) {
	    	var firebaseUrl = "https://sopps.firebaseio.com/";
	    	console.log(user.uid);
	        $firebaseRef.default.child("userProfile").child(user.uid).update({
	        "institution": syncObject.$bindTo($scope.userProfile.institution)
        }).catch(function(error){
        	console.log(error);
        });
      });
	};


	/**
	 * This function will call our service and log the user out.
	 */
	$scope.myPicture = {};
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
	  }
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
					body:    'Yet to Implement'
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
.controller('WordpressPostCtrl', function($scope, post_data, $ionicLoading, $ionicPopup,$cordovaSocialSharing,  $cordovaLocalNotification) {

	$scope.post = post_data.post;
	$ionicLoading.hide();


	$scope.sharePost = function(link){
		window.plugins.socialsharing.share('Check this student opportunity here: ', null, null, link);
	};

	$scope.openDatePicker = function() {
      var remindWhen = $ionicPopup.show({
        template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
        title: "When to Remind",
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Select</b>',
          type: 'button-stable',
          onTap: function () {
			var alarmTime = new Date();
			alarmTime.setMinutes(alarmTime.getMinutes() + 1);
			$cordovaLocalNotification.schedule({
			id: 1,
			text: 'shareopps Notification',
			title: 'You created a Reminder',
			date: alarmTime,
			autoCancel: true,
			sound: null
		    }).then(function () {
		      alert("Instant Notification set");
		    });
  		}
        }]
      });
    };

    $scope.isScheduled = function() {
        $cordovaLocalNotification.isScheduled("1").then(function(isScheduled) {
            alert("Notification 1234 Scheduled: " + isScheduled);
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

;
