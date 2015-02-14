app.directive("userDetails", function(identity, Globals) {
    "use strict";

    return {
        restrict: "A",
        templateUrl: "/partials/common/userDetails",
        replace: false
    };
});