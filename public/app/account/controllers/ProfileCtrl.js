app.controller('ProfileCtrl', function ProfileCtrl($scope, $location, usersData, identity, notifier, Globals) {
    "use strict";

    $scope.avatarImgPrefix = Globals.avatarImgPrefix;
    $scope.user = {
        username: identity.currentUser.username,
        email: identity.currentUser.email,
        avatarUrl: identity.currentUser.avatarUrl,
        posts: "NOT_SET",
        rating: identity.currentUser.stats.rating
    };

    // TODO: fix logout after update profile
    $scope.update = function (updatedUser) {
        usersData.update(updatedUser).then(function (data) {
            if(data.reason) {
                notifier.success(data.reason);
            }

            if(data.avatarUrl) {
                identity.currentUser.avatarUrl = data.avatarUrl;
            }

            if (data.email) {
                identity.currentUser.email = data.email;
            }

            $location.path("/profile");
            //auth.logout();
            //$location.path('/login');
        }, function (err) {
            if(err.reason){
                notifier.error(err.reason);
            }
        });
    };
});