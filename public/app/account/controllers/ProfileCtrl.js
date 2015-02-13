/* global app, angular */

'use strict';

app.controller('ProfileCtrl', function ($scope, $location, auth, usersData, identity, notifier) {

    $scope.user = {
        username: identity.currentUser.username,
        email: "to@be.added",
        avatarUrl: identity.currentUser.avatarUrl,
        posts: 123
    };

    // TODO: fix logout after update profile
    $scope.update = function (updatedUser) {
        usersData.update(updatedUser).then(function (data) {
            if(data.reason) {
                notifier.success(data.reason);
            }
            if(data.avatarUrl) {
                $scope.user.avatarUrl = data.avatarUrl;
                identity.currentUser.avatarUrl = data.avatarUrl;
            }
            //auth.logout();
            //$location.path('/login');
        }, function (err) {
            if(err.reason){
                notifier.success(err.reason);
            }
        });
    };
});