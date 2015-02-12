/* global app, angular */

'use strict';

app.factory('usersData', function ($http, $q, identity) {

    var getUserFormData = function (user) {
        var formData = new FormData();
        formData.append('_id', identity.currentUser._id);
        formData.append('username', user.username);
        formData.append('password', user.password || '');
        formData.append('image', user.image);

        return formData;
    };

    function getById(id) {
        var deferred = $q.defer();

        $http.get('/api/users/' + id)
            .success(function (user) {
                deferred.resolve(user);
            })
            .error(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    var updateUser = function (updatedUser) {
        var deferred = $q.defer();

        var formData = getUserFormData(updatedUser);

        $http.put('/api/users', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }
        )
            .success(function (user) {
                deferred.resolve(user);
            })
            .error(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    return {
        getById: getById,
        update: updateUser
    };
});