/* global app, angular */

'use strict';

app.controller('ProfileCtrl', function ($scope, $location, auth, usersData, identity, notifier) {

    $scope.user = {
        username: identity.currentUser.username,
        firstName: identity.currentUser.firstName,
        lastName: identity.currentUser.lastName,
        avatarUrl: identity.currentUser.avatarUrl
    };

    // TODO: fix logout after update profile
    $scope.update = function (updatedUser) {
        usersData.update(updatedUser).then(function (data) {
            console.log(data);
            if(data.reason){
                notifier.success(data.reason);
            }
            if(data.avatarUrl){
                $scope.user.avatarUrl = data.avatarUrl;
            }
            //auth.logout();
            //$location.path('/login');
        }, function (err) {
            if(err.reason){
                notifier.succes(err.reason);
            }
        });
    };
});