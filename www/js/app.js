// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAU09uwLQeRX4pQtjAD_c39dSrcCwSUUNU",
    authDomain: "vivapp-36b9b.firebaseapp.com",
    databaseURL: "https://vivapp-36b9b.firebaseio.com",
    projectId: "vivapp-36b9b",
    storageBucket: "vivapp-36b9b.appspot.com",
    messagingSenderId: "418254242423"
  };
  firebase.initializeApp(config);

var app = angular.module('starter', ['ionic', 'firebase', 'ionic.contrib.ui.tinderCards'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

// create new route for login page. 
//Doesnt need 'app.login' terminology nor 'view' as routes bellow as it's a different page
.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    //here it says if we open the login page we can use any function within auth controller 
    controller: 'AuthCtrl as auth' 
  })

.state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl as prof',
        resolve: {

          // History function fixed the issue of going back to the homepage via match page
          history: function($ionicHistory) {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
          },  

          auth: function($state, Auth) {
            return Auth.requireAuth().catch(function() {
              $state.go('login'); //redirect users to login page if not logged in
            });
          },

          //if user is logged, retunr user's info on profile
          profile: function(Auth) {
            return Auth.requireAuth().then(function(auth) {
              return Auth.getProfile(auth.uid).$loaded();
            });
          },

          about: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth) {
                return Auth.getAbout(auth.facebook.accessToken);
              })
              .then(function(object) {
                return object.data.bio;
              });
          },

          images: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth) {
                return Auth.getImages(auth.facebook.accessToken);
              })
              .then(function(object) {
                return object.data.data;
              });
          }
        }
      }
    }
  })
  
  // This creates a controller to the homepage 
  //so we can call 'service' function and get all into into the app's homepage
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        //create home.js page under controller
        controller: 'HomeCtrl as home',
        resolve: {
          auth: function($state, Auth) {
            return Auth.requireAuth().catch(function() {
              $state.go('login');
            });
          },

          // Reques users to authenticate their Ids before going to their homepages
          uid: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth) {
                return auth.uid;
              });
          }
        }
      }
    }
  })

  // This creates an URL for match page
  .state('app.match', {
    url: '/match',
    views: {
      'menuContent': {
        templateUrl: 'templates/match.html',
        controller: 'MatchCtrl as matc',
        resolve: {
        // keep authentification as only authenticaed users can see their match pages  
          history: function($ionicHistory) {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
          },
           
          auth: function($state, Auth) {
            return Auth.requireAuth().catch(function() {
              $state.go('login');
            });
          },

          uid: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth) {
                Auth.setOnline(auth.uid);
                return auth.uid;
              });
          },

          profile: function(Auth){
          return Auth.requireAuth()
          .then(function(auth){
          return Auth.getProfile(auth.uid).$loaded();
            })
          }
        }
      }
    }
  })
  
  //add "resolve" authentication function to ensure only logged in users can access settings page
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingCtrl as sett', //link Setting Controller new page to settings
        resolve: {
          auth: function($state, Auth) {
            return Auth.requireAuth().catch(function() {
              $state.go('login');
            });
          }
        }
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
