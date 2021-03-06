app.controller('MessagesCtrl', function ($scope, $location, identity, MessageService, notifier, auth) {
    'use strict';

    $scope.isMoreMessages = true;

    function loadMessages() {
        MessageService.getMessages()
            .then(function (data) {
                $scope.messages = data;
            });
    }

    function renderLikedMessage(id) {
        var $likesContainer = angular.element("article.status[data-id='" + id + "']").find("p.likes-num"),
            parsedLikes = parseInt($likesContainer.html());

        if (!isNaN(parsedLikes)) {
            $likesContainer.html(parsedLikes + 1);
        } else {
            loadMessages();
        }
    }

    function renderMutedMessages(username) {
        angular.element("article.status[data-user='" + username + "']").fadeOut(250);
    }

    if (identity.isAuthenticated()) {
        loadMessages();
    }

    if (identity.socket) {
        identity.socket.on('newMessage', function (data) {
            $scope.messages = [data].concat($scope.messages);
            $scope.$apply();
        });
    }
    else {
        auth.logout();
        $location.path("/");
    }

    $scope.send = function (message) {
        if (!!message) {
            if (message.content.length) {
                MessageService.createMessage(message)
                    .then(function () {
                        notifier.success('Мисълта ти е споделена');
                        $scope.message = undefined;
                    }, function (err) {
                        if (err.reason) {
                            notifier.error(err.reason);
                        }
                    });
            }
        }
        else {
            notifier.error('Трябва да въведеш някакъв текст');
        }
    };

    $scope.likeMessage = function (id) {
        MessageService.likeMessage(id)
            .then(function () {
                renderLikedMessage(id);
                notifier.success('Успешно харесано');
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
                renderMutedMessages(username);

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
                    if (data.length < 20) {
                        $scope.isMoreMessages = false;
                    }
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
