// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var wtf = angular.module('whatthefood', ['ionic', 'whatthefood.controllers', 'whatthefood.services', 'ngCordova', 'ngStorage', 'ng-walkthrough','angularMoment'])

  .run(['$ionicPlatform', function ($ionicPlatform,amMoment) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  }])

  .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.icon('ion-chevron-left');
  }])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    // FB init
    openFB.init({appId: '443745395811172'});

    var RESOLVER = {
      rulist: function (rulistservice) {

        return rulistservice.getRestaurantsD()
      },
      menus: function (rulistservice) {

        return  rulistservice.getMenusD()
      },
      user: function (User) {
        return User.queryD('me')
      }
    }



    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('login', {
        url: "/login",
        views: {
          '': {
            templateUrl: "WhatTheFood/components/Login/loginview.html",
            controller: 'loginctrl'
          }
        }
      })

      // setup an abstract state for the tabs directive
      .state('wtf', {
        url: "/wtf",
        abstract: true,
        templateUrl: "WhatTheFood/shared/basecontent.html",
        controller: 'basectrl'
      })

      .state('wtf.about', {
        url: "/about",
        views: {
          'menuContent': {
            controller: 'aboutctrl',
            templateUrl: 'WhatTheFood/components/About/about.html',
          }
        }
      })

      // Each tab has its own nav history stack:
      .state('wtf.rulist', {
        url: '/rulist',
        views: {
          'menuContent': {
            templateUrl: 'WhatTheFood/components/RU/rulistview.html',
            controller: 'rulistctrl'
          }
        },
        resolve:RESOLVER
      })

      .state('wtf.rucontent', {
        url: '/rucontent/:ruId',
        views: {
          'menuContent': {
            templateUrl: 'WhatTheFood/components/RU/rucontentview.html',
            controller: 'rucontentctrl'
          }
        }
      })

      .state('wtf.rueat', {
        url: '/rueat/:ruId',
        views: {
          'menuContent': {
            templateUrl: 'WhatTheFood/components/RU/rueatview.html',
            controller: 'rueatctrl'
          }
        }
      })

      .state('wtf.ruqueue', {
        url: '/ruqueue/:ruId',
        views: {
          'menuContent': {
            templateUrl: 'WhatTheFood/components/RU/ruqueueview.html',
            controller: 'ruqueuectrl'
          }
        }
      })

      .state('wtf.lunch', {
        url: '/lunch',
        views: {
          'menuContent': {
            templateUrl: 'WhatTheFood/components/Lunch/lunchstartview.html',
            controller: 'lunchstartctrl'
          }
        },
        resolve:RESOLVER
      })

      .state('wtf.quizz', {
        url: '/quizz',
        views: {
          'menuContent': {
            templateUrl: 'WhatTheFood/components/Lunch/lunchquizzview.html',
            controller: 'lunchquizzctrl'
          }
        }
      })

      .state('wtf.thanks', {
        url: '/thanks',
        views: {
          'menuContent': {
            templateUrl: 'WhatTheFood/components/Lunch/lunchthanksview.html',
            controller: 'lunchthanksctrl'
          }
        }
      })

      .state('wtf.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'WhatTheFood/components/Profile/profileview.html',
            controller: 'profilectrl'
          }
        }
      })

      .state('wtf.stats', {
        url: '/stats',
        views: {
          'menuContent': {
            templateUrl: 'WhatTheFood/components/Stats/statsview.html',
            controller: 'statsctrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  }]);


wtf.constant('angularMomentConfig', {
  preprocess: 'utc',
  timezone: 'Europe/Paris'
});