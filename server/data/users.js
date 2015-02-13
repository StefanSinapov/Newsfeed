'use strict';

var User = require('mongoose').model('User');

module.exports = {
    create: function(user, callback) {
        User.create(user, callback);
    },
    findById: function(id, callback){
        User.findOne({_id: id}).exec(callback);
    },
    findByUsername: function(username, callback){
        User.findOne({username: username}).exec(callback);
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
    update: function(id, user, callback){
        User.update({ _id: id }, user, callback);
    }
};