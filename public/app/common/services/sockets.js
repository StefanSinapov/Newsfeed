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
            .on('newMessage', function (data) {
                console.log(data);
            })
            .on('authenticated', function () {
                console.log('- authenticated');
            })
            .on('disconnect', function () {
                console.log('- disconnected');
            });

        return socket;
    }

    return {
        connect: connect
    };
});