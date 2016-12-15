angular.module('sopps.controllers', [])

.controller('AuthCtrl', function($scope, $state, $ionicConfig, AuthService) {

})

.controller('AppCtrl', function($scope, $ionicConfig) {

})

.controller('LogInCtrl', function($scope, $state, AuthService, $ionicLoading, $ionicPopup) {
  $scope.login = function(user){
    $ionicLoading.show({
      template: 'Logging in ...'
    });

    AuthService.doLogin(user)
    .then(function(data){
      // success
      $state.go('app.my');
      $ionicLoading.hide();
    },function(err){
      // error
      $scope.errors = err;
      console.log(err);
      $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
      });
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
  $scope.courseOfStudy =
   [
   "Civil Engineering",
   "Electrical Engineering",
   "Chemical Engineering",
   "Mechanical Engineering",
   "Metallurgical Engineering",
   "Computer Science"
   ];


  $scope.institution =
   [
   "University of Pretoria",
   "University of Witswaterand",
   "Tshwane University of Technology",
   "University of Johannesburg",
   "University of Cape Town",
   "University of Kwazulu-Natal",
   "Stellenbosch University",
   "Rhodes University",
   "University of South Africa",
   "Vaal University of Technology",
   "University of Venda",
   "University of Zululand",
   "University of the Western Cape",
   "Walter Sisulu University"
   ];



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

.controller('UserCtrl', function($scope, $state, $firebaseRef, $firebaseObject, $firebaseArray, AuthService){
  $scope.data={};
  $scope.current_user = {};
  $scope.userProfile = AuthService.userProfileData();
  $scope.quantity = 1;

  var current_user = AuthService.getUser();

  var userProfile = AuthService.userProfileData();

  
 var img = new Firebase("https://sopps.firebaseio.com/users/"+ current_user.uid +"/images");
  $scope.imgs = $firebaseArray(img);

 var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
  $scope.uploadFile = function() {
    var sFileName = $("#nameImg").val();
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j
< _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          var filesSelected = document.getElementById("nameImg").files;
          if (filesSelected.length >
	0) {
            var fileToLoad = filesSelected[0];

            var fileReader = new FileReader();

            fileReader.onload = function(fileLoadedEvent) {
              var textAreaFileContents = document.getElementById(
                "textAreaFileContents"
              );


              $scope.imgs.$add({
                date: Firebase.ServerValue.TIMESTAMP,
                base64: fileLoadedEvent.target.result
              });
            };

            fileReader.readAsDataURL(fileToLoad);
          }
          break;
        }
      }

      if (!blnValid) {
        alert('File is not valid');
        return false;
      }
    }

    return true;
  }

  

  $scope.deleteimg = function(imgid) {
    var r = confirm("Do you want to remove this image ?");
    if (r == true) {
      $scope.imgs.forEach(function(childSnapshot) {
        if (childSnapshot.$id == imgid) {
            $scope.imgs.$remove(childSnapshot).then(function(ref) {
              ref.key() === childSnapshot.$id; // true
            });
        }
      });
    }
  }

  
   

  if(current_user && current_user.provider == "facebook"){
    $scope.current_user.email = current_user.facebook.displayName;
    $scope.current_user.image = current_user.facebook.profileImageURL;
    $scope.current_user.uid = current_user.uid;

  } else {
    $scope.current_user.email = current_user.password.email;
    $scope.current_user.image = current_user.password.profileImageURL;
    $scope.current_user.uid = current_user.uid;

  }


  	$scope.changeInstitution = function(changeInstitutionForm){
	  if (changeInstitutionForm.$valid) {
	    AuthService.changeInstitution($scope.userProfile.institution, $scope.data.newInstitution, $scope.data.password);
	    $scope.userProfile.institution = $scope.data.newInstitution;
	    $scope.userProfile.$save();
	  }
	};


	$scope.changeCourseOfStudy = function(changeCourseForm){
	  if (changeCourseForm.$valid) { 
	    AuthService.changeCourseOfStudy($scope.userProfile.courseOfStudy, $scope.data.email, $scope.data.password);
	    $scope.userProfile.courseOfStudy = $scope.data.newCourseOfStudy;
	    $scope.userProfile.$save();
	  }
	};

	/**
	 * This function will get the oldPassword and newPassword values from the form and then pass them
	 * to our changePassword() function inside the auth service.
	 */
	$scope.changePassword = function(changePasswordForm){
	  if (changePasswordForm.$valid) {
	    var oldPassword = $scope.data.oldPassword;
	    var newPassword = $scope.data.newPassword;
	    
	    AuthService.changePassword(userProfile.email, oldPassword, newPassword);
	  }
	};

	$scope.changeEmail = function(changeEmailForm){
	  if (changeEmailForm.$valid) {
	    AuthService.changeEmail(userProfile.email, $scope.data.newEmail, $scope.data.password);
	    $scope.userProfile.email = $scope.data.newEmail;
	    $scope.userProfile.$save();
	  }
	};

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
	$scope.sendOpportunity = function () {

		    
		  $scope.message = {
		    'opportunityContactEmail' : '',
		    'opportunityName' :'',
		    'opportunityDescription' : '',
		    'opportunityContactPerson' : '',
		    'opportunityBenefits' : '',
		    'opportunityDeadline' : ''
		  };

	    // Simple POST request example (passing data) :
	    $http.post('action.php', $scope.message).
	        success(function(data, status, headers, config) {
	            // this callback will be called asynchronously
	            // when the response is available

			$ionicLoading.show({ 
				template: 'Opportunity Post Successfully sent to ShareOpps Admin!',
				 noBackdrop: true, 
				 duration: 1000 });

	        }).
	        error(function(data, status, headers, config) {
	            // called asynchronously if an error occurs
	            // or server returns response with an error status.
	        });

	};

})

.controller('ResetPasswordCtrl', function($scope,$ionicLoading, $ionicConfig, AuthService) {
	$scope.data = {};

	$scope.resetPassword = function(resetPasswordForm){
		if (resetPasswordForm.$valid) {

			$scope.errorMessage = null;

	    

		AuthService.resetPassword( $scope.data.email);



		}
	};
})

.controller('ProfileCtrl', function($firebaseRef, $scope, user, AuthService, $state, $ionicPopup, $firebaseObject){
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


})



;