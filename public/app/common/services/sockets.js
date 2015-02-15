app.factory("Sockets", function(notifier) {
    'use strict';

    function connect (token) {
        console.log('Opening socket on the client');
        var socket = io.connect(token ? ('?token=' + token) : '', {
            'forceNew': true
        });

        socket
            .on('pong', function () {
                console.log('- pong');
            })
            .on('time', function (data) {
                console.log('- broadcast: ' + data);
            })
            .on('authenticated', function () {
                console.log('- authenticated');
            })
            .on('disconnect', function () {
                console.log('- disconnected');
            })
            .on('likeNotification', function(data) {
                if(data.username){
                    notifier.success(data.username + ' хареса ваш пост!');
                }
            })
            .on('blockNotification', function(data) {
                if(data.username){
                    notifier.warning(data.username + ' ви заглуши!');
                }
            })
            .on('unBlockNotification', function(data) {
                if(data.username){
                    notifier.success(data.username + ' премахна заглушаването ви!');
                }
            });

        return socket;
    }

    return {
        connect: connect
    };
});