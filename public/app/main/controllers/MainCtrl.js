app.controller("MainCtrl", function MainCtrl($scope, $location, identity) {
    "use strict";

    if (identity.isAuthenticated()) {
        $location.path("/feed");
    }
});
