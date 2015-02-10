/* global app */

'use strict';

app.controller('SignUpCtrl', function ($scope, $location, auth, notifier) {
    $scope.signup = function (user, singUpForm) {
        if (singUpForm.$valid) {

            if (user.password === user.confirmPassword) {

                auth.signup(user).then(function () {
                    notifier.success('Registration successful!');
                    $location.path('/');
                }, function (response) {
                    if (response.reason) {
                        notifier.error('Error creating account: ' + response.reason);
                    }
                    else {
                        notifier.error("The request is invalid. (Check your connectivity)");
                    }
                });
            }
            else {
                notifier.error('Password and confirm password must be the same!');
            }
        }
        else {
            notifier.error('First name, Last name, Username and password are required fields.');
        }
    };

    $scope.logout = function() {
        auth.logout().then(function() {
            notifier.success('Successful logout!');
            $scope.user.username = '';
            $scope.user.password = '';
            $location.path('/');
        });
    };
});