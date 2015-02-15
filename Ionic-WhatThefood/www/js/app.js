// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var wtf = angular.module('whatthefood', ['ionic', 'whatthefood.controllers', 'whatthefood.services'])

    .run(function($ionicPlatform) {

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });


    })

    .config(function($stateProvider, $urlRouterProvider) {

		// FB init
		openFB.init({appId: '576723975798203'});

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('login', {
                url: "/login",
                templateUrl: "WhatTheFood/components/Login/loginview.html",
                controller: 'loginctrl'
            })
            
            // setup an abstract state for the tabs directive
            .state('wtf', {
                url: "/wtf",
                abstract: true,
                templateUrl: "WhatTheFood/shared/basecontent.html"
            })

            // Each tab has its own nav history stack:

            .state('wtf.rulist', {
                url: '/rulist',
                views: {
                    'menuContent': {
                        templateUrl: 'WhatTheFood/components/RU/rulistview.html',
                        controller: 'rulistctrl'
                    }
                }
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
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });


