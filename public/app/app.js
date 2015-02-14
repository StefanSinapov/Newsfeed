/* global angular, toastr */

'use strict';

var app = angular.module('app', ['ngResource', 'ngRoute']).value('toastr', toastr);

app.config(function ($routeProvider) {

    var routeUserChecks = {
        //adminRole: {
        //    authenticate: function (auth) {
        //        return auth.isAuthorizedForRole('admin');
        //    }
        //},
        authenticated: {
            authenticate: function (auth) {
                return auth.isAuthenticated();
            }
        }
    };

    $routeProvider
        .when('/', {
            templateUrl: '/partials/main/home',
            controller: 'MainCtrl'
        })
        .when('/signup', {
            templateUrl: '/partials/account/signup',
            controller: 'SignUpCtrl'
        })
        .when('/login', {
            templateUrl: 'partials/account/login',
            controller: 'LoginCtrl'
        })
        .when('/feed', {
            templateUrl: '/partials/feed/feed',
            controller: 'MessagesCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/profile', {
            templateUrl: 'partials/account/profile',
            controller: 'ProfileCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/edit-profile', {
            templateUrl: 'partials/account/editProfile',
            controller: 'ProfileCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/members', {
            templateUrl: 'partials/members/members',
            controller: 'MembersCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/member/:name', {
            templateUrl: 'partials/members/profile',
            controller: 'MemberDetailsCtrl',
            resolve: routeUserChecks.authenticated
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.run(function ($rootScope, $window, notifier) {
    $rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
        if (rejection === 'not authorized') {
            notifier.error('You are not authorized!');
            $window.history.back();
        }
    });
});