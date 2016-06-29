angular.module('your_app_name.factories', [])

/*.factory('Auth', function($firebaseAuth) {
  var firebaseUrl = "https://shareopps.firebaseio.com/"

  var usersRef = new Firebase(firebaseUrl+'/users');
  return $firebaseAuth(usersRef);
})*/

.factory('AuthService', function($firebaseAuth, $firebaseObject, $firebaseArray, $state, $firebaseRef){

  var firebaseUrl = "https://shareopps.firebaseio.com/"
  var authUser = $firebaseAuth($firebaseRef.default);

  return {
    /*
      The function receives an email, password, name and creates a new user
      After the user is created it stores the user details in the DB.
    */
    signupEmail: function(newEmail, newPassword, newFullName){

    /**
     * Here we're using angular-fire $createUser to create a new user, just passing the email, password and
     * full name.
     *
     * After that we're creating the record in the DB in a "userProfile" node, remember,
     * creating a user doesn't show him/her in the DB, so we need to create that record ourselves.
     *
     * And then we are catching any errors that might happen :P
     */
      authUser.$createUser({
        email: newEmail,
        password: newPassword,
        fullName: newFullName,
      }).then(function(authData){
        authUser.$authWithPassword({
          "email": newEmail,
          "password": newPassword
        }).then (function(authData){
            $firebaseRef.default.child("userProfile").child(authData.uid).set({
            name: newFullName,
            email: newEmail,
          });
          $state.go('profile');
        });           
      }).catch(function(error){
          switch (error.code) {
            case "EMAIL_TAKEN":
              alert("Bro, someone's using that email!");
              break;
            case "INVALID_EMAIL":
              alert("Dude, that is not an email address!");
              break;
            default:
              alert("Error creating user:", error);
          }
      });
    },

  /**
   * Here we are login our user in, we user angular-fire $authWithPassword assing the email and password.
   * After that we send the user to our dashboard.
   */
    loginUser: function(email, password){
      authUser.$authWithPassword({
        "email": email,
        "password": password
      }).then (function(authData){
        $state.go('profile');
      }).catch(function(error){
        console.log(error);
      });
    },

    logoutUser: function(){
      authUser.$unauth();
      $state.go('login');
    },

  /**
   * This one explain itself, if the user doesn't remember his password he'll click in the "forgot you password?"
   * link and we need to send him a token so he can log in again
   *
   * NOTE: This doesn't send a reset password link, this sends a token he can use as a password to log in and
   * change his password to something he remembers.
   */
    resetPassword: function(resetEmail){
      authUser.$resetPassword({
        email: resetEmail
      }).then(function(){
        console.log('Password Reset Email was sent successfully');
      }).catch(function(error){
        console.log(error);
      });
    },

    /**
     * This is going to take the user's email + oldPassword + newPassword and change the Password
     * used for login.
     * After changing the password it's going to redirect the user to the profile page.
     */
    changePassword: function(email, oldPassword, newPassword){
      authUser.$changePassword({
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword
      }).then(function(){
        alert('Password Changed!');
        $state.go('profile');
      }).catch(function(error){
        console.log(error);
      });
    },

    /**
     * This is going to take the user's oldEmail + newEmail + password and change the email
     * used for login.
     *
     * Remember, afeter changing the login email we also need to update the userProfile.userId node
     * I'm going to handle this in the controller using the userProfileData function below.
     */
    changeEmail: function(oldEmail, newEmail, password){
      authUser.$changeEmail({
        oldEmail: oldEmail,
        newEmail: newEmail,
        password: password
      }).then(function(){
          alert('Cambiaste tu correo!');
          $state.go('profile');
      }).catch(function(error){
        console.log(error);
      });
    },
    /**
     * This will return the userProfile.userId node so we can update the email.
     */
    userProfileData: function(userId){
      var userProfileRef = $firebaseRef.default.child('userProfile').child(userId);
      return $firebaseObject(userProfileRef);
    }

  }

})



.factory('Messages', function($firebaseArray) {
  var messagesRef = new Firebase(firebaseUrl);
  return $firebaseArray(messagesRef);
})


.factory('FeedLoader', function ($resource){
  return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
    fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
  });
})


// Factory for node-pushserver (running locally in this case), if you are using other push notifications server you need to change this
.factory('NodePushServer', function ($http){
  // Configure push notifications server address
  //- If you are running a local push notifications server you can test this by setting the local IP (on mac run: ipconfig getifaddr en1)
  var push_server_address = "http://192.168.1.102:8000";

  return {
    // Stores the device token in a db using node-pushserver
    // type:  Platform type (ios, android etc)
    storeDeviceToken: function(type, regId) {
      // Create a random userid to store with it
      var user = {
        user: 'user' + Math.floor((Math.random() * 10000000) + 1),
        type: type,
        token: regId
      };
      console.log("Post token for registered device with data " + JSON.stringify(user));

      $http.post(push_server_address+'/subscribe', JSON.stringify(user))
      .success(function (data, status) {
        console.log("Token stored, device is successfully subscribed to receive push notifications.");
      })
      .error(function (data, status) {
        console.log("Error storing device token." + data + " " + status);
      });
    },
    // CURRENTLY NOT USED!
    // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
    // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
    // time the app opens which this currently does. However in many cases you will always receive the same device token as
    // previously so multiple userids will be created with the same token unless you add code to check).
    removeDeviceToken: function(token) {
      var tkn = {"token": token};
      $http.post(push_server_address+'/unsubscribe', JSON.stringify(tkn))
      .success(function (data, status) {
        console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
      })
      .error(function (data, status) {
        console.log("Error removing device token." + data + " " + status);
      });
    }
  };
})


/*.factory('AdMob', function ($window){
  var admob = $window.AdMob;

  if(admob)
  {
    // Register AdMob events
    // new events, with variable to differentiate: adNetwork, adType, adEvent
    document.addEventListener('onAdFailLoad', function(data){
      console.log('error: ' + data.error +
      ', reason: ' + data.reason +
      ', adNetwork:' + data.adNetwork +
      ', adType:' + data.adType +
      ', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
    });
    document.addEventListener('onAdLoaded', function(data){
      console.log('onAdLoaded: ' + data);
    });
    document.addEventListener('onAdPresent', function(data){
      console.log('onAdPresent: ' + data);
    });
    document.addEventListener('onAdLeaveApp', function(data){
      console.log('onAdLeaveApp: ' + data);
    });
    document.addEventListener('onAdDismiss', function(data){
      console.log('onAdDismiss: ' + data);
    });

    var defaultOptions = {
      // bannerId: admobid.banner,
      // interstitialId: admobid.interstitial,
      // adSize: 'SMART_BANNER',
      // width: integer, // valid when set adSize 'CUSTOM'
      // height: integer, // valid when set adSize 'CUSTOM'
      position: admob.AD_POSITION.BOTTOM_CENTER,
      // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
      bgColor: 'black', // color name, or '#RRGGBB'
      // x: integer,		// valid when set position to 0 / POS_XY
      // y: integer,		// valid when set position to 0 / POS_XY
      isTesting: true, // set to true, to receiving test ad for testing purpose
      // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
    };
    var admobid = {};

    if(ionic.Platform.isAndroid())
    {
      admobid = { // for Android
        banner: 'ca-app-pub-6869992474017983/9375997553',
        interstitial: 'ca-app-pub-6869992474017983/1657046752'
      };
    }

    if(ionic.Platform.isIOS())
    {
      admobid = { // for iOS
        banner: 'ca-app-pub-6869992474017983/4806197152',
        interstitial: 'ca-app-pub-6869992474017983/7563979554'
      };
    }

    admob.setOptions(defaultOptions);

    // Prepare the ad before showing it
    // 		- (for example at the beginning of a game level)
    admob.prepareInterstitial({
      adId: admobid.interstitial,
      autoShow: false,
      success: function(){
        console.log('interstitial prepared');
      },
      error: function(){
        console.log('failed to prepare interstitial');
      }
    });
  }
  else
  {
    console.log("No AdMob?");
  }

  return {
    showBanner: function() {
      if(admob)
      {
        admob.createBanner({
          adId:admobid.banner,
          position:admob.AD_POSITION.BOTTOM_CENTER,
          autoShow:true,
          success: function(){
            console.log('banner created');
          },
          error: function(){
            console.log('failed to create banner');
          }
        });
      }
    },
    showInterstitial: function() {
      if(admob)
      {
        // If you didn't prepare it before, you can show it like this
        // admob.prepareInterstitial({adId:admobid.interstitial, autoShow:autoshow});

        // If you did prepare it before, then show it like this
        // 		- (for example: check and show it at end of a game level)
        admob.showInterstitial();
      }
    },
    removeAds: function() {
      if(admob)
      {
        admob.removeBanner();
      }
    }
  };
})
*/
/*.factory('iAd', function ($window){
  var iAd = $window.iAd;

  // preppare and load ad resource in background, e.g. at begining of game level
  if(iAd) {
    iAd.prepareInterstitial( { autoShow:false } );
  }
  else
  {
    console.log("No iAd?");
  }

  return {
    showBanner: function() {
      if(iAd)
      {
        // show a default banner at bottom
        iAd.createBanner({
          position:iAd.AD_POSITION.BOTTOM_CENTER,
          autoShow:true
        });
      }
    },
    showInterstitial: function() {
      // ** Notice: iAd interstitial Ad only supports iPad.
      if(iAd)
      {
        // If you did prepare it before, then show it like this
        // 		- (for example: check and show it at end of a game level)
        iAd.showInterstitial();
      }
    },
    removeAds: function() {
      if(iAd)
      {
        iAd.removeBanner();
      }
    }
  };
})*/

;
