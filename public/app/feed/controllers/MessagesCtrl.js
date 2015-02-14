app.controller('MessagesCtrl', function ($scope, $location, identity, MessageService, notifier) {
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
                notifier.success('Успешно заглушен');
                loadMessages();
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
