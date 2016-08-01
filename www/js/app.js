// Ionic Starter App

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('your_app_name', [
  'ionic','ionic.service.core',
  'angularMoment',
  'your_app_name.config',
  'your_app_name.controllers',
  'your_app_name.directives',
  'your_app_name.filters',
  'your_app_name.services',
  'your_app_name.factories',
  'your_app_name.views',
  'underscore',
  'ngMap',
  'ngResource',
  'ngCordova',
  'slugifier',
  'firebase',
  'ionic.contrib.ui.tinderCards',
  'youtube-embed'
])

.run(function($ionicPlatform, PushNotificationsService, $rootScope, $ionicConfig, $timeout, $cordovaLocalNotification) {

  $ionicPlatform.on("deviceready", function(){
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    PushNotificationsService.register();
  });
  // This fixes transitions for transparent background views
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if(toState.name.indexOf('auth.walkthrough') > -1)
    {
      // set transitions to android to avoid weird visual effect in the walkthrough transitions
      $timeout(function(){
        $ionicConfig.views.transition('android');
        $ionicConfig.views.swipeBackEnabled(false);
        console.log("setting transition to android and disabling swipe back");
      }, 0);
    }
  });

            /*
            Cath the stateError for un-authenticated users
            */
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
    if (error === "AUTH_REQUIRED") {
      $state.go('login');
    }
  });

  $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
    if(toState.name.indexOf('app.feeds-categories') > -1)
    {
      // Restore platform default transition. We are just hardcoding android transitions to auth views.
      $ionicConfig.views.transition('platform');
      // If it's ios, then enable swipe back again
      if(ionic.Platform.isIOS())
      {
        $ionicConfig.views.swipeBackEnabled(true);
      }
      console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
    }
  });

  $ionicPlatform.on("resume", function(){
    PushNotificationsService.register();
  });

  $ionicPlatform.ready(function () {
    if (ionic.Platform.isWebView()) {
    }
  })

})

.config(function($firebaseRefProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $firebaseRefProvider.registerUrl("https://sopps.firebaseio.com/");

  $stateProvider

  //INTRO
  .state('auth', {
    url: "/auth",
    templateUrl: "views/auth/auth.html",
    abstract: true,
    controller: 'AuthCtrl'
  })

  .state('auth.walkthrough', {
    url: '/walkthrough',
    templateUrl: "views/auth/walkthrough.html"
  })

  .state('auth.login', {
    url: '/login',
    templateUrl: "views/auth/login.html",
    controller: 'LoginCtrl'
  })

  .state('auth.signup', {
    url: '/signup',
    templateUrl: "views/auth/signup.html",
    controller: 'SignupCtrl'
  })

  .state('auth.forgot-password', {
    url: "/forgot-password",
    templateUrl: "views/auth/forgot-password.html",
    controller: 'ForgotPasswordCtrl'
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })

  .state('app.feedback', {
    url: "/feedback",
    views: {
      'menuContent': {
        templateUrl: "views/app/feedback/feedback.html",
        controller: 'SendMailCtrl'
      }
    }
  })

  .state('app.chat', {
    url: '/chat',
    views: {
      'menuContent': {
        templateUrl: "views/app/chat/chats.html",
        controller: 'ChatCtrl'
      }
    }
})

  //FEEDS
  .state('app.feeds-categories', {
    url: "/feeds-categories",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/feeds-categories.html",
        controller: 'FeedsCategoriesCtrl'
      }
    }
  })

  .state('app.category-feeds', {
    url: "/category-feeds/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/category-feeds.html",
        controller: 'CatsPostsCtrl'
      }
    }
  })

  .state('app.feed-entries', {
    url: "/feed-entries/:categoryId/:sourceId",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/feed-entries.html",
        controller: 'FeedEntriesCtrl'
      }
    }
  })

  //WORDPRESS
  .state('app.wordpress', {
    url: "/wordpress",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/wordpress.html",
        controller: 'WordpressCtrl'
      }
    }
  })
  //WORDPRESS
  .state('app.category', {
    url: "/category",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/categories.html",
        controller: 'WordpressCtrl2'
      }
    }
  })
  .state('app.category_detail', {
    url: "/category/:slug",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/categories_post.html",
        controller: 'CategoryPostCtrl'
      }
    }
  })
  .state('app.post', {
    url: "/wordpress/:postId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/wordpress_post.html",
        controller: 'WordpressPostCtrl'
      }
    },
    resolve: {
      post_data: function(PostService, $ionicLoading, $stateParams) {
        $ionicLoading.show({
          template: 'Loading ...'
        });

        var postId = $stateParams.postId;
        return PostService.getPost(postId);
      }
    }
  })
  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "views/app/profile.html",
        controller: 'ProfileCtrl'
      }
    },
    resolve: {
      user: function($firebaseAuthService) {
        return $firebaseAuthService.$requireAuth();
      }
    }
  })

  .state('changeEmail', {
    url: '/changeEmail',
    templateUrl: 'views/app/changeEmail.html',
    controller: 'ProfileCtrl',
    resolve: {
      user: function($firebaseAuthService) {
        return $firebaseAuthService.$requireAuth();
      }
    }
  })

  .state('changePassword', {
    url: '/changePassword',
    templateUrl: 'views/app/changePassword.html',
    controller: 'ProfileCtrl',
    resolve: {
      user: function($firebaseAuthService) {
        return $firebaseAuthService.$requireAuth();
      }
    }
  })
  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "views/app/bookmarks.html",
        controller: 'BookMarksCtrl'
      }
    }
  })

;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/auth/walkthrough');
});