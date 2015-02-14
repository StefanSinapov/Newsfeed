app.controller("MemberDetailsCtrl", function MemberDetailsCtrl($scope, $routeParams, $location, MembersResource, MessageService, identity) {
    "use strict";

    $scope.isUserDetails = true;

    if ($routeParams.name === identity.currentUser.username) {
        $location.path("/profile");
    }

    MembersResource.get({ name: $routeParams.name }).$promise.then(function (member) {
        if (member.isNull) {
            $location.path("/members");
        }

        $scope.user = {
            username: member.username,
            email: member.email,
            avatarUrl: member.avatarUrl,
            posts: "NOT_SET",
            rating: member.stats.rating,
            isMuted: _isCurrentUserMuted(member.username)
        };

        $scope.mute = function () {
            MessageService.blockUser(member.username)
                .then(function () {
                    notifier.success('Успешно заглушен');
                }, function (err) {
                    if (err.reason) {
                        notifier.error(err.reason);
                    }
                });
        };
        
        $scope.unmute = function () {
            
        }
    });

    function _isCurrentUserMuted(username) {
        var i = 0,
            muted = identity.currentUser.blockedUsers;

        for (i; i < muted.length; i += 1) {
            if (username === muted[i]) {
                return true;
            }
        }

        return false;
    }
});