// Ionic Starter App

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('sopps', [
  'ionic','ionic.service.core',
  'sopps.config',
  'sopps.controllers',
  'sopps.directives',
  'sopps.filters',
  'sopps.services',
  'sopps.factories',
  'sopps.views',
  'underscore',
  'ngMap',
  'ngResource',
  'ngCordova',
  'slugifier',
  'firebase'
])

.run(function($ionicPlatform, $rootScope, $state, AuthService) {
  $ionicPlatform.ready(function(){
    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === true)
      {
        $state.go('app.user');
      }
      else
      {
        $state.go('auth.login');
      }
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  // UI Router Authentication Check
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.data.authenticate)
    {
      AuthService.userIsLoggedIn().then(function(response)
      {
        if(response === false)
        {
          event.preventDefault();
          $state.go('auth.login');
        }
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $firebaseRefProvider) {

 
  $firebaseRefProvider

  .registerUrl('https://sopps.firebaseio.com/');


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the auth section
  .state('auth', {
    url: "/auth",
    templateUrl: "views/auth/auth.html",
    abstract: true,
    controller: 'AuthCtrl'
  })

  .state('auth.login', {
    url: '/login',
    views: {
      'auth-view': {
        templateUrl: 'views/auth/login.html',
        controller: 'LogInCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('auth.signup', {
    url: '/signup',
    views: {
      'auth-view': {
        templateUrl: 'views/auth/signup.html',
        controller: 'SignUpCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })


  .state('app.user', {
    url: '/user',
    views: {
      'main-view': {
        templateUrl: 'views/app/user.html',
        controller: 'UserCtrl'
      }
    },
    data: {
      authenticate: true
    }
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
      'main-view': {
        templateUrl: "views/app/feedback/feedback.html",
        controller: 'SendMailCtrl'
      }
    }
  })

  .state('app.category-feeds', {
    url: "/category-feeds/:categoryId",
    views: {
      'main-view': {
        templateUrl: "views/app/feeds/category-feeds.html",
        controller: 'CatsPostsCtrl'
      }
    }
  })

  //WORDPRESS
  .state('app.my', {
    url: "/my",
    views: {
      'main-view': {
        templateUrl: "views/app/wordpress/my-opportunity.html",
        controller: 'MyOpportunityCtrl',
        
      }
    },   
    data: {
      authenticate: true
    }
  })

  //WORDPRESS
  .state('app.wordpress', {
    url: "/wordpress",
    views: {
      'main-view': {
        templateUrl: "views/app/wordpress/wordpress.html",
        controller: 'WordpressCtrl',
        authRequired: true
      }
    }
  })

  //WORDPRESS
  .state('app.category', {
    url: "/category",
    views: {
      'main-view': {
        templateUrl: "views/app/wordpress/categories.html",
        controller: 'WordpressCtrl2',
        authRequired: true
      }
    }
  })

  .state('app.category_detail', {
    url: "/category/:slug",
    views: {
      'main-view': {
        templateUrl: "views/app/wordpress/categories_post.html",
        controller: 'CategoryPostCtrl'
      }
    }
  })

  .state('app.post', {
    url: "/wordpress/:postId",
    views: {
      'main-view': {
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
      'main-view': {
        templateUrl: "views/app/profile.html",
        controller: 'ProfileCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('changeCourseOfStudy', {
    url: '/changeCourseOfStudy',
    templateUrl: 'views/app/changeCourseOfStudy.html',
    controller: 'UserCtrl',
    resolve: {
      user: function($firebaseAuthService) {
        return $firebaseAuthService.$requireAuth();
      }
    }
  })

  .state('changeInstitution', {
    url: '/changeInstitution',
    templateUrl: 'views/app/changeInstitution.html',
    controller: 'UserCtrl',
    resolve: {
      user: function($firebaseAuthService) {
        return $firebaseAuthService.$requireAuth();
      }
    }
  })

  .state('changeEmail', {
    url: '/changeEmail',
    templateUrl: 'views/app/changeEmail.html',
    controller: 'UserCtrl',
    resolve: {
      user: function($firebaseAuthService) {
        return $firebaseAuthService.$requireAuth();
      }
    }
  })

  .state('changePassword', {
    url: '/changePassword',
    templateUrl: 'views/app/changePassword.html',
    controller: 'UserCtrl',
    resolve: {
      user: function($firebaseAuthService) {
        return $firebaseAuthService.$requireAuth();
      }
    }
  })

  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'main-view': {
        templateUrl: "views/app/bookmarks.html",
        controller: 'BookMarksCtrl'
      }
    }
  })

    .state('app.submit', {
    url: "/submit",
    views: {
      'main-view': {
        templateUrl: "views/app/wordpress/post_opportunity.html",
        controller: 'SubmitCtrl'
      }
    }
  })

;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/auth/login');
});
