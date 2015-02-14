app.controller("MembersCtrl", function MembersCtrl($scope, MessageService, notifier) {
    "use strict";

    function getUsers(username){
        MessageService.getUsers(username)
            .then(function (data) {
                $scope.members = data;
            }, function (error) {
                notifier.error('Нещо се обърка');
                console.log(error);
            });
    }

    getUsers();

    $scope.search = function(username){
        getUsers(username);
    };
});