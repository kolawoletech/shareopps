/* jshint ignore:start */
angular.module('sopps.services', [])

.service('AuthService', function($q,$firebaseRef, $firebaseObject, $ionicLoading, $firebaseArray,$ionicPopup, $state){
  var _firebase = new Firebase("https://sopps.firebaseio.com/");
  var authData = _firebase.getAuth();
  
	this.resetPassword = function(email){
	    this.errorMessage = null;


	      $ionicLoading.show({
	        template: 'Email is being sent...'
	      });


	      _firebase.resetPassword({
	    		email: email})
	          .then(showConfirmation)
	          .catch(handleError);

	    function showConfirmation() {
	      this.emailSent = true;
	      $ionicLoading.hide();
	    }

	    function handleError(error) {
	      switch (error.code) {
	        case 'INVALID_EMAIL':
	        case 'INVALID_USER':
	          this.errorMessage = 'Invalid email';
	          break;
	        default:
	          this.errorMessage = 'Error: [' + error.code + ']';
	      }
                    $ionicPopup.alert({
                title: 'Reset Password Failed!',
                template: 'User does not exist!'
      });

              $ionicLoading.hide();


	     
	    }
	};  

    this.userProfileData = function(){
      var userProfileRef = $firebaseRef.default.child('users').child(authData.uid);
      return $firebaseObject(userProfileRef);
    };
  
	this.changePassword = function(email, oldPassword, newPassword){
	  _firebase.changePassword({
	    email: email,
	    oldPassword: oldPassword,
	    newPassword: newPassword
	  }).then(function(){
	    alert('Password Changed!');
	    $state.go('app.user');
	  }).catch(function(error){
	    console.log(error);
	  });
	};

	this.changeEmail = function(oldEmail, newEmail, password){
	  _firebase.changeEmail({
	    oldEmail: oldEmail,
	    newEmail: newEmail,
	    password: password
	  }).then(function(){
	    alert('Email Changed!');
	    $state.go('app.user');
	  }).catch(function(error){
	    console.log(error);
	  });
	};

    this.changeInstitution = function(email, password){
        _firebase.authWithPassword({
            email    : email,
      		password : password
        }).then(function(authData){
            $firebaseRef.default.child("userProfile").child(authData.uid).set({
            institution: newInstitution,          
          }).then(function(){
            alert('Institution Successfully Changed!');
            $state.go('app.user');
          });       
        }).catch(function(error){
           console.log(error);
        });
    };

     this.changeCourseOfStudy = function(email, password){
        _firebase.authWithPassword({
            email    : email,
      		password : password
        }).then(function(authData){
            $firebaseRef.default.child("userProfile").child(authData.uid).set({
            institution: newCourseOfStudy         
          }).then(function(){
            alert('Course Of Study Successfully Changed!');
            $state.go('app.user');
          });       
        }).catch(function(error){
           console.log(error);
        });
    };


  this.userIsLoggedIn = function(){
    var deferred = $q.defer(),
        authService = this,
        isLoggedIn = (authService.getUser() !== null);

    deferred.resolve(isLoggedIn);

    return deferred.promise;
  };

  this.getUser = function(){
    return _firebase.getAuth();
  };


  this.doLogin = function(user){
    var deferred = $q.defer();

    _firebase.authWithPassword({
      email    : user.email,
      password : user.password
    }, function(errors, data) {
      if (errors) {
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
      } else {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  };


  this.doFacebookLogin = function(){
    var deferred = $q.defer();

    _firebase.authWithOAuthPopup("facebook", function(errors, data) {
      if (errors) {
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
      } else {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  };

 
  this.doSignup = function(user){
    var deferred = $q.defer(),
        authService = this;

    _firebase.createUser({
      email    : user.email,
      password : user.password,
      fullName : user.fullName,
      institution: user.institution,
      courseOfStudy: user.courseOfStudy
    }, function(errors, data) {
      if (errors) {
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
      } else {
        // After signup we should automatically login the user
        _firebase.child("users").child(authData.uid).set({
	      email    : user.email,
	      fullName : user.fullName,
	      institution: user.institution,
	      courseOfStudy: user.courseOfStudy
        }).then() 
        authService.doLogin(user)   // jshint ignore:line
        .then(function(data){        // jshint ignore:line
          // success     
          deferred.resolve(data);      // jshint ignore:line
        },function(err){             // jshint ignore:line
          // error
          deferred.reject(err);        // jshint ignore:line
        });

      }
    });

    return deferred.promise;
  };

  this.doLogout = function(){
    _firebase.unauth();
  };

this.doFacebookLogin = function(){
  var deferred = $q.defer();

  _firebase.authWithOAuthPopup("facebook", function(errors, data) {
    if (errors) {
      var errors_list = [],
          error = {
            code: errors.code,
            msg: errors.message
          };
      errors_list.push(error);
      deferred.reject(errors_list);
    } else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
};

})


.service('FeedList', function ($rootScope, FeedLoader, $q){
	this.get = function(feedSourceUrl) {
		var response = $q.defer();
		//num is the number of results to pull form the source
		FeedLoader.fetch({q: feedSourceUrl, num: 20}, {}, function (data){
			response.resolve(data.responseData);
		});
		return response.promise;
	};
})


// PUSH NOTIFICATIONS
.service('PushNotificationsService', function ($rootScope, $cordovaPush, NodePushServer, GCM_SENDER_ID){
	/* Apple recommends you register your application for push notifications on the device every time it’s run since tokens can change. The documentation says: ‘By requesting the device token and passing it to the provider every time your application launches, you help to ensure that the provider has the current token for the device. If a user restores a backup to a device other than the one that the backup was created for (for example, the user migrates data to a new device), he or she must launch the application at least once for it to receive notifications again. If the user restores backup data to a new device or reinstalls the operating system, the device token changes. Moreover, never cache a device token and give that to your provider; always get the token from the system whenever you need it.’ */
	this.register = function() {
		var config = {};

		// ANDROID PUSH NOTIFICATIONS
		if(ionic.Platform.isAndroid())
		{
			config = {
				"senderID": GCM_SENDER_ID
			};

			$cordovaPush.register(config).then(function(result) {
				// Success
				console.log("$cordovaPush.register Success");
				console.log(result);
			}, function(err) {
				// Error
				console.log("$cordovaPush.register Error");
				console.log(err);
			});

			$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
				console.log(JSON.stringify([notification]));
				switch(notification.event)
				{
					case 'registered':
						if (notification.regid.length > 0 ) {
							console.log('registration ID = ' + notification.regid);
							NodePushServer.storeDeviceToken("android", notification.regid);
						}
						break;

					case 'message':
						if(notification.foreground == "1")
						{
							console.log("Notification received when app was opened (foreground = true)");
						}
						else
						{
							if(notification.coldstart == "1")
							{
								console.log("Notification received when app was closed (not even in background, foreground = false, coldstart = true)");
							}
							else
							{
								console.log("Notification received when app was in background (started but not focused, foreground = false, coldstart = false)");
							}
						}

						// this is the actual push notification. its format depends on the data model from the push server
						console.log('message = ' + notification.message);
						break;

					case 'error':
						console.log('GCM error = ' + notification.msg);
						break;

					default:
						console.log('An unknown GCM event has occurred');
						break;
				}
			});

			// WARNING: dangerous to unregister (results in loss of tokenID)
			// $cordovaPush.unregister(options).then(function(result) {
			//   // Success!
			// }, function(err) {
			//   // Error
			// });
		}

		if(ionic.Platform.isIOS())
		{
			config = {
				"badge": true,
				"sound": true,
				"alert": true
			};

			$cordovaPush.register(config).then(function(result) {
				// Success -- send deviceToken to server, and store for future use
				console.log("result: " + result);
				NodePushServer.storeDeviceToken("ios", result);
			}, function(err) {
				console.log("Registration error: " + err);
			});

			$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
				console.log(notification.alert, "Push Notification Received");
			});
		}
	};
})


// BOOKMARKS FUNCTIONS
.service('BookMarkService', function (_, $rootScope){

	this.bookmarkFeedPost = function(bookmark_post){

		var user_bookmarks = !_.isUndefined(window.localStorage.ionFullApp_feed_bookmarks) ?
														JSON.parse(window.localStorage.ionFullApp_feed_bookmarks) : [];

		//check if this post is already saved

		var existing_post = _.find(user_bookmarks, function(post){ return post.link == bookmark_post.link; });

		if(!existing_post){
			user_bookmarks.push({
				link: bookmark_post.link,
				title : bookmark_post.title,
				date: bookmark_post.publishedDate,
				excerpt: bookmark_post.contentSnippet
			});
		}

		window.localStorage.ionFullApp_feed_bookmarks = JSON.stringify(user_bookmarks);
		$rootScope.$broadcast("new-bookmark");
	};

	this.bookmarkWordpressPost = function(bookmark_post){

		var user_bookmarks = !_.isUndefined(window.localStorage.ionFullApp_wordpress_bookmarks) ?
														JSON.parse(window.localStorage.ionFullApp_wordpress_bookmarks) : [];

		//check if this post is already saved

		var existing_post = _.find(user_bookmarks, function(post){ return post.id == bookmark_post.id; });

		if(!existing_post){
			user_bookmarks.push({
				id: bookmark_post.id,
				title : bookmark_post.title,
				date: bookmark_post.date,
				excerpt: bookmark_post.excerpt
			});
		}

		window.localStorage.ionFullApp_wordpress_bookmarks = JSON.stringify(user_bookmarks);
		$rootScope.$broadcast("new-bookmark");
	};

	this.getBookmarks = function(){
		return {
			feeds : JSON.parse(window.localStorage.ionFullApp_feed_bookmarks || '[]'),
			wordpress: JSON.parse(window.localStorage.ionFullApp_wordpress_bookmarks || '[]')
		};
	};
})


// WP POSTS RELATED FUNCTIONS
.service('PostService', function ($rootScope, $http, $q, WORDPRESS_API_URL, $stateParams){

	this.getRecentPosts = function(page) {
		var deferred = $q.defer();

		$http.jsonp(WORDPRESS_API_URL + 'get_recent_posts/' +
		'?page='+ page +
		'&callback=JSON_CALLBACK')
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(data) {
			deferred.reject(data);
		});

		return deferred.promise;
	};

	this.createPost = function(page) {
		var deferred = $q.defer();

		$http.jsonp(WORDPRESS_API_URL + '/posts/create_post/' +
		'?page='+ page +
		'&callback=JSON_CALLBACK')
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(data) {
			deferred.reject(data);
		});

		return deferred.promise;
	};

	this.getCategoryPosts = function(post) {
		var deferred = $q.defer();

		$http.jsonp('http://shareopps.co.za/app/?json=get_category_index' +
		'&callback=JSON_CALLBACK')
		.success(function(data) {
			deferred.resolve(data);
			console.log(data.categories);
		})
		.error(function(data) {
			deferred.reject(data);
		});

		return deferred.promise;
	};

	this.getPost = function(postId) {
		var deferred = $q.defer();

		$http.jsonp(WORDPRESS_API_URL + 'get_post/' +
		'?post_id='+ postId +
		'&callback=JSON_CALLBACK')
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(data) {
			deferred.reject(data);
		});

		return deferred.promise;
	};
	//slug = postId
	this.getCatPost = function(slug) {
		var deferred = $q.defer();

		$http.jsonp(WORDPRESS_API_URL + 'get_category_post/' +
		'?slug='+ slug +
		'&callback=JSON_CALLBACK')
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(data) {
			deferred.reject(data);
		});

		return deferred.promise;
	};


	this.shortenPosts = function(posts) {
		//we will shorten the post
		//define the max length (characters) of your post content
		var maxLength = 500;
		return _.map(posts, function(post){
			if(post.content.length > maxLength){
				//trim the string to the maximum length
				var trimmedString = post.content.substr(0, maxLength);
				//re-trim if we are in the middle of a word
				trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("</p>")));
				post.content = trimmedString;
			}
			return post;
		});
	};


})


;
/* jshint ignore:end */