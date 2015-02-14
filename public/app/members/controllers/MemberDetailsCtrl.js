app.controller("MemberDetailsCtrl", function MemberDetailsCtrl($scope, $routeParams, MembersResource) {
    "use strict";

    $scope.isUserDetails = true;

    MembersResource.get({ name: $routeParams.name }).$promise.then(function (member) {
        $scope.user = {
            username: member.username,
            email: member.email,
            avatarUrl: member.avatarUrl,
            posts: "NOT_SET",
            rating: member.stats.rating
        };
    });
});