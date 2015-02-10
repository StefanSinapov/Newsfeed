/* global app */

"use strict";

app.directive("authBar", function() {
    return {
        restrict: "A",
        templateUrl: "/partials/account/auth-bar",
        replace: true
    };
});