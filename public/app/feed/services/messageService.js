/* global app */

'use strict';

app.factory('MessageService', function ($q, $http, $resource) {

    var apiRoute = '/api/messages/';

    function makeQuery(options) {
        var deferred = $q.defer();

        $http(options)
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function getJson(url) {
        return makeQuery({
            method: 'GET',
            url: url
        });
    }

    function postJson(url, data) {
        return makeQuery({
            method: 'POST',
            url: url,
            data: data
        });
    }

    function putJson(url, data) {
        return makeQuery({
            method: 'PUT',
            url: url,
            data: data
        });
    }

    function deleteJson(url) {
        return makeQuery({
            method: 'DELETE',
            url: url
        });
    }

    return {
        getMessages: function (count) {
            var route = apiRoute;
            if (count) {
                route += '?skip=' + count;
            }
            return getJson(route);
        },
        createMessage: function (messageData) {
            return postJson(apiRoute, messageData);
        },
        likeMessage: function (id) {
            return putJson('/api/messages/' + id);
        },
        blockUser: function(username){
            return postJson('/api/users/'+ username);
        },
        unBlockUser: function(username){
            return putJson('/api/users/'+ username);
        },
        getUsers: function(username){
            if(username){
                username = '?username=' + username;
            }else{
                username = '';
            }
            return getJson('/api/users/' + username);
        },
        resource: $resource(apiRoute)
    };
});