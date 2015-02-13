/* global app */

'use strict';

app.controller('SignUpCtrl', function ($scope, $location, auth, notifier) {
    $scope.signup = function (user, signUpForm) {
        if (signUpForm.$valid) {
            if (user.password === user.confirmPassword) {
                auth.signup(user).then(function () {
                    notifier.success('Регистрирване успешно!');
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
            notifier.error('Username and password are required fields.');
        }
    };
});