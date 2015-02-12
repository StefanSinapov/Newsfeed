'use strict';

var Message = require('mongoose').model('Message');

module.exports = {
    create: function (message, callback) {
        Message.create(message, callback);
    },
    updateAvatars: function (username, avatarUrl, callback) {
        Message.update({username: username}, {$set: {avatarUrl: avatarUrl}}, {multi: true}, callback);
    }
};