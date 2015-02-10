/* global app, angular */

'use strict';

app.controller('ProfileCtrl', function ($scope, $location, auth, usersData, identity, notifier) {

    $scope.user = {
        username: identity.currentUser.username,
        firstName: identity.currentUser.firstName,
        lastName: identity.currentUser.lastName,
        imageUrl: identity.currentUser.imageUrl
    };

    // TODO: fix logout after update profile
    $scope.update = function (updatedUser) {
        usersData.update(updatedUser).then(function () {
            notifier.success('Updated successfully!');
            auth.logout();
            $location.path('/login');
        }, function (err) {
            notifier.error(err.message);
        });
    };
});