angular.module('your_app_name.factories', [])

.factory('Auth', function($firebaseAuth) {
  var firebaseUrl = "https://sopps.firebaseio.com/";
  //Creation of U
  var usersRef = new Firebase(firebaseUrl+'/users');
  return $firebaseAuth(usersRef);
})

.factory('AuthService', function($firebaseAuth, $firebaseObject, $firebaseArray, $state, $firebaseRef){

  var authUser = $firebaseAuth($firebaseRef.default);

  return {
    /*
      The function receives an email, password, name and creates a new user
      After the user is created it stores the user details in the DB.
    */
    signupEmail: function(newEmail, newPassword, newFullName, newInstitution, newCourseOfStudy){

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
        institution: newInstitution,
        courseOfStudy: newCourseOfStudy
      }).then(function(authData){
        authUser.$authWithPassword({
          "email": newEmail,
          "password": newPassword
        }).then (function(authData){
            $firebaseRef.default.child("userProfile").child(authData.uid).set({
            name: newFullName,
            email: newEmail,
            institution: newInstitution,
            newCourseOfStudy: newCourseOfStudy
          });
          $state.go('app.profile');
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
        $state.go('app.wordpress');
      }).catch(function(error){
        console.log(error);
      });
    },

    logoutUser: function(){
      authUser.$unauth();
      $state.go('auth.login');
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
          alert('Email Successfully Changed!');
          $state.go('app.profile');
      }).catch(function(error){
        console.log(error);
      });
    },

    changeInstitution : function(email, password){
        authUser.$authWithPassword({
          email: email
        }).then(function(authData){
            $firebaseRef.default.child("userProfile").child(authData.uid).set({
            institution: newInstitution,          
          }).then(function(){
            alert('Institution Successfully Changed!');
            $state.go('app.profile');
          });       
        }).catch(function(error){
           console.log(error);
        });
    },
    changeCourseOfStudy : function(email, password){
        authUser.$authWithPassword({
          email: email,
          password: password
        }).then(function(authData){
            $firebaseRef.default.child("userProfile").child(authData.uid).set({
            courseOfStudy: newCourseOfStudy,          
          }).then(function(){
            alert('Institution Successfully Changed!');
            $state.go('app.profile');
            }) ;
          }) .catch(function(error){
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

  };

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

;