'use strict';

var User = require('mongoose').model('User');

module.exports = {
    create: function(user, callback) {
        User.create(user, callback);
    },
    checkIfUsernameIsFree: function(username, callback){
        User.find({username : username}, function (err, data) {
            if (!data.length){
                console.log(data.length + " is free");
                return true;
            }else{
                console.log(data.length + " is NOT free");
                return false;
            }
        });
    },
    //TODO: add update avatar
    update: function(id, user, callback){
        User.update({ _id: id }, user, callback);
    }
};