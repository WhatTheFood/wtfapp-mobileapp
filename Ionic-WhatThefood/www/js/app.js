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
            })

            .state('wtf.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('wtf.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })

            .state('wtf.friends', {
                url: '/friends',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/tab-friends.html',
                        controller: 'FriendsCtrl'
                    }
                }
            })
            .state('wtf.friend-detail', {
                url: '/friend/:friendId',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/friend-detail.html',
                        controller: 'FriendDetailCtrl'
                    }
                }
            })

            .state('wtf.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });


