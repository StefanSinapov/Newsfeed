/* global app, angular */

'use strict';

app.factory('auth', function ($http, $q, identity, UsersResource, notifier, Sockets) {

    /*function connect (token) {
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
                console.log('New message from ' + data.from);
                notifier.success('New message from ' + data.from);
            })
            .on('authenticated', function () {
                console.log('- authenticated');
            })
            .on('disconnect', function () {
                console.log('- disconnected');
            });

        return socket;
    }*/

    return {
        signup: function(user) {
            var deferred = $q.defer();

            user = new UsersResource(user);

            user.$save().then(function() {
                identity.currentUser = user;
                deferred.resolve();
            }, function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        },
        login: function(user){
            var deferred = $q.defer();

            $http.post('/login', user).success(function(response) {
                if (response.success) {
                    var user = new UsersResource();
                    angular.extend(user, response.user);
                    identity.currentUser = user;
                    identity.token = response.token;
                    identity.socket = Sockets.connect(response.token);
                    deferred.resolve(true);
                }
                else {
                    deferred.resolve(false);
                }
            });

            return deferred.promise;
        },
        logout: function() {
            var deferred = $q.defer();

            $http.post('/logout').success(function() {
                identity.currentUser = undefined;
                deferred.resolve();
            });

            return deferred.promise;
        },
        isAuthenticated: function() {
            if (identity.isAuthenticated()) {
                return true;
            }
            else {
                return $q.reject('not authorized');
            }
        },
        isAuthorizedForRole: function(role) {
            if (identity.isAuthorizedForRole(role)) {
                return true;
            }
            else {
                return $q.reject('not authorized');
            }
        }
    };
});