angular.module('your_app_name.controllers', [])

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function($scope, $ionicConfig) {

})


//LOGIN
.controller('LoginCtrl', function(Auth, $scope, $state, $templateCache, $q, $rootScope) {
	$scope.loginWithGoogle = function loginWithGoogle() {
	    Auth.$authWithOAuthPopup('facebook')
	      .then(function(authData) {
	        $state.go('app.wordpress');
	    });
  	};

	$scope.doLogIn = function(){
		$state.go('app.wordpress');
	};

	$scope.user = {};

	$scope.user.email = "john@doe.com";
	$scope.user.pin = "12345";

	// We need this for the form validation
	$scope.selected_tab = "";

	$scope.$on('my-tabs-changed', function (event, data) {
		$scope.selected_tab = data.title;
	});
})

<<<<<<< HEAD
.controller('SignupCtrl', function(AuthService, $scope, $state) {
	$scope.data = {};
=======
.controller('SignupCtrl', function(Auth, $scope, $state, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {
	$scope.user = {};
	$scope.createUser = function (user) {
	    console.log("Create User Function called");
	    if (user && user.email && user.password) {
	        $ionicLoading.show({
	            template: 'Signing Up...'
	        });

	        Auth.$createUser({
	            email: user.email,
	            password: user.password
	        }).then(function (userData) {
	            alert("User created successfully!");
	            ref.child("users").child(userData.uid).set({
	                email: user.email,
	                displayName: user.displayname
	            });
	            $ionicLoading.hide();
	            $scope.modal.hide();
	        }).catch(function (error) {
	            alert("Error: " + error);
	            $ionicLoading.hide();
	        });
	    } else
	        alert("Please fill all details");
	}

	$scope.signIn = function (user) {

	    if (user && user.email && user.pwdForLogin) {
	        $ionicLoading.show({
	            template: 'Signing In...'
	        });
	        Auth.$authWithPassword({
	            email: user.email,
	            password: user.pwdForLogin
	        }).then(function (authData) {
	            console.log("Logged in as:" + authData.uid);
	            ref.child("users").child(authData.uid).once('value', function (snapshot) {
	                var val = snapshot.val();
	                // To Update AngularJS $scope either use $apply or $timeout
	                $scope.$apply(function () {
	                    $rootScope.displayName = val;
	                });
	            });
	            $ionicLoading.hide();
	            $state.go('tab.rooms');
	        }).catch(function (error) {
	            alert("Authentication failed:" + error.message);
	            $ionicLoading.hide();
	        });
	    } else
	        alert("Please enter email and password both");
	}

/*	$scope.user = {};
>>>>>>> e1398d1ae5584a3ceac3df1b19e11196a2347274

	$scope.createUser = function(signupForm){
		if (signupForm.$valid) {
			var newEmail = $scope.data.email;
			var newPassword = $scope.data.password;
			var newFullName = $scope.data.fullName;
			var selectedPlan = $state.params.pId;
			AuthService.signupEmail(newEmail, newPassword, newFullName, selectedPlan);
		};

<<<<<<< HEAD
	};
=======
	$scope.doSignUp = function(){
		$state.go('app.feeds-categories');
	};*/
>>>>>>> e1398d1ae5584a3ceac3df1b19e11196a2347274
})


.controller('ForgotPasswordCtrl', function($scope, $state) {
	$scope.recoverPassword = function(){
		$state.go('app.feeds-categories');
	};

	$scope.user = {};
})

/*.controller('RateApp', function($scope) {
	$scope.rateApp = function(){
		if(ionic.Platform.isIOS()){
			//you need to set your own ios app id
			AppRate.preferences.storeAppURL.ios = '1234555553>';
			AppRate.promptForRating(true);
		}else if(ionic.Platform.isAndroid()){
			//you need to set your own android app id
			AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
			AppRate.promptForRating(true);
		}
	};
})*/

.controller('ChatCtrl', function($scope, $state, $ionicPopup, Messages) {

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
    var ref = new Firebase("https://shareopps.firebaseio.com/");
    ref.unauth();
    $state.go('login');
  };
})

.controller('SendMailCtrl', function($scope) {
	$scope.sendMail = function(){
		cordova.plugins.email.isAvailable(
			function (isAvailable) {
				// alert('Service is not available') unless isAvailable;
				cordova.plugins.email.open({
					to:      'mail@shareopps.co.za',
					cc:      'admin@sthareopps.co.za',
					// bcc:     ['john@doe.com', 'jane@doe.com'],
					subject: 'MAIL sent from App User',
					body:    'Yet to Implement'
				});
			}
		);
	};
})

.controller('MapsCtrl', function($scope, $ionicLoading) {

	$scope.info_position = {
		lat: 43.07493,
		lng: -89.381388
	};

	$scope.center_position = {
		lat: 43.07493,
		lng: -89.381388
	};

	$scope.my_location = "";

	$scope.$on('mapInitialized', function(event, map) {
		$scope.map = map;
	});

	$scope.centerOnMe= function(){

		$scope.positions = [];

		$ionicLoading.show({
			template: 'Loading...'
		});

		// with this function you can get the user’s current position
		// we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$scope.current_position = {lat: pos.G,lng: pos.K};
			$scope.my_location = pos.G+", "+pos.K;
			$scope.map.setCenter(pos);
			$ionicLoading.hide();
		});
	};
})

/*.controller('AdsCtrl', function($scope, $ionicActionSheet, AdMob, iAd) {

	$scope.manageAdMob = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
				{ text: 'Show Banner' },
				{ text: 'Show Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				AdMob.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show Banner')
				{
					console.log("show banner");
					AdMob.showBanner();
				}

				if(button.text == 'Show Interstitial')
				{
					console.log("show interstitial");
					AdMob.showInterstitial();
				}

				return true;
			}
		});
	};

	$scope.manageiAd = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
			{ text: 'Show iAd Banner' },
			{ text: 'Show iAd Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show - Interstitial only works in iPad',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				iAd.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show iAd Banner')
				{
					console.log("show iAd banner");
					iAd.showBanner();
				}
				if(button.text == 'Show iAd Interstitial')
				{
					console.log("show iAd interstitial");
					iAd.showInterstitial();
				}
				return true;
			}
		});
	};
})*/

// FEED
//brings all feed categories
.controller('FeedsCategoriesCtrl', function($scope, $http) {
	$scope.feeds_categories = [];

	$http.get('feeds-categories.json').success(function(response) {
		$scope.feeds_categories = response;
	});
})

//bring specific category providers
.controller('CategoryFeedsCtrl', function($scope, $http, $stateParams) {
	$scope.category_sources = [];

	$scope.categoryId = $stateParams.categoryId;

	$http.get('feeds-categories.json').success(function(response) {
		var category = _.find(response, {id: $scope.categoryId});
		$scope.categoryTitle = category.title;
		$scope.category_sources = category.feed_sources;
	});
})

//this method brings posts for a source provider
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

// SETTINGS
.controller('SettingsCtrl', function($scope, $ionicActionSheet, $state) {
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
})

// TINDER CARDS
/*.controller('TinderCardsCtrl', function($scope, $http) {

	$scope.cards = [];


	$scope.addCard = function(img, name) {
		var newCard = {image: img, name: name};
		newCard.id = Math.random();
		$scope.cards.unshift(angular.extend({}, newCard));
	};

	$scope.addCards = function(count) {
		$http.get('http://api.randomuser.me/?results=' + count).then(function(value) {
			angular.forEach(value.data.results, function (v) {
				$scope.addCard(v.user.picture.large, v.user.name.first + " " + v.user.name.last);
			});
		});
	};

	$scope.addFirstCards = function() {
		$scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png","Nope");
		$scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
	};

	$scope.addFirstCards();
	$scope.addCards(5);

	$scope.cardDestroyed = function(index) {
		$scope.cards.splice(index, 1);
		$scope.addCards(1);
	};

	$scope.transitionOut = function(card) {
		console.log('card transition out');
	};

	$scope.transitionRight = function(card) {
		console.log('card removed to the right');
		console.log(card);
	};

	$scope.transitionLeft = function(card) {
		console.log('card removed to the left');
		console.log(card);
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


.controller('ImagePickerCtrl', function($scope, $rootScope, $cordovaCamera) {

	$scope.images = [];

	$scope.selImages = function() {

		window.imagePicker.getPictures(
			function(results) {
				for (var i = 0; i < results.length; i++) {
					console.log('Image URI: ' + results[i]);
					$scope.images.push(results[i]);
				}
				if(!$scope.$$phase) {
					$scope.$apply();
				}
			}, function (error) {
				console.log('Error: ' + error);
			}
		);
	};

	$scope.removeImage = function(image) {
		$scope.images = _.without($scope.images, image);
	};

	$scope.shareImage = function(image) {
		window.plugins.socialsharing.share(null, null, image);
	};

	$scope.shareAll = function() {
		window.plugins.socialsharing.share(null, null, $scope.images);
	};
})

;
