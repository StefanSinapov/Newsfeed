'use strict';

var User = require('mongoose').model('User');

module.exports = {
    create: function(user, callback) {
        User.create(user, callback);
    },
    //TODO: add update avatar
    update: function(id, user, callback){
        User.update({ _id: id }, user, callback);
    }
};