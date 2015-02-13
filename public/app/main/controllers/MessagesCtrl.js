app.controller('MessagesCtrl', function ($scope, $location, identity, MessageService, notifier) {
    'use strict';
    $scope.send = function(message){
        MessageService.createMessage(message)
            .then(function(data){
                notifier.success('Мисълта ти е споделена');
                $scope.message.content = '';
            }, function(err){
                console.log(err);
                if(err.reason){
                    notifier.error(err.reason);
                }
            });
    };
});
