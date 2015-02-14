app.controller('MessagesCtrl', function ($scope, $location, identity, MessageService, notifier, auth) {
    'use strict';

    function loadMessages() {
        MessageService.getMessages()
            .then(function (data) {
                $scope.messages = data;
            });
    }

    if (identity.isAuthenticated()) {
        loadMessages();
    }

    if(identity.socket){
        identity.socket.on('newMessage', function (data) {
            $scope.messages= [data].concat($scope.messages);
            $scope.$apply();
        });
    }
    else{
        auth.logout();
        $location.path("/");
    }

    $scope.send = function (message) {
        MessageService.createMessage(message)
            .then(function () {
                notifier.success('Мисълта ти е споделена');
                $scope.message.content = '';
            }, function (err) {
                console.log(err);
                if (err.reason) {
                    notifier.error(err.reason);
                }
            });
    };

    $scope.likeMessage = function (id) {
        MessageService.likeMessage(id)
            .then(function () {
                notifier.success('Успешно харесано');
                loadMessages();
            }, function (err) {
                if (err.reason) {
                    notifier.error(err.reason);
                }
            });
    };

    $scope.blockUser = function (username) {
        MessageService.blockUser(username)
            .then(function () {
                identity.currentUser.blockedUsers.push(username);
                loadMessages();

                notifier.success('Успешно заглушен');
            }, function (err) {
                if (err.reason) {
                    notifier.error(err.reason);
                }
            });
    };

    $scope.loadMore = function (count) {
        MessageService.getMessages(count)
            .then(function (data) {
                if (data.length > 0) {
                    $scope.messages = $scope.messages.concat(data);
                }
            }, function (err) {
                console.log(err);
                if (err.reason) {
                    notifier.error(err.reason);
                }
            });
    };
});
