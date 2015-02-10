'use strict';

app.controller('MainCtrl', function ($scope, $location, identity) {
    $scope.identity = identity;
});
