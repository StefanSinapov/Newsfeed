/* global angular, toastr */

'use strict';

var app = angular.module('app', ['ngResource', 'ngRoute']).value('toastr', toastr);

app.config(function ($routeProvider) {

    var routeUserChecks = {
        adminRole: {
            authenticate: function (auth) {
                return auth.isAuthorizedForRole('admin');
            }
        },
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