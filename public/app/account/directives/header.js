/* global app */

"use strict";

app.directive("header", function() {
    return {
        restrict: "A",
        templateUrl: "/partials/account/header",
        replace: true
    };
});