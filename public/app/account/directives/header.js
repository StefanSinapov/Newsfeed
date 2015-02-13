/* global app */

"use strict";

app.directive("header", function(identity, Globals) {
    return {
        restrict: "A",
        templateUrl: "/partials/account/header",
        link: function(scope, element, attrs) {
            scope.identity = identity;
            scope.avatarImgPrefix = Globals.avatarImgPrefix;
        },
        replace: true
    };
});