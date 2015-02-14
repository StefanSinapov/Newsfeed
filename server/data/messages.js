'use strict';

var Message = require('mongoose').model('Message');

module.exports = {
    create: function (message, callback) {
        Message.create(message, callback);
    },
    updateAvatars: function (username, avatarUrl, callback) {
        Message.update({username: username}, {$set: {avatarUrl: avatarUrl}}, {multi: true}, callback);
    },
    getMessagesForUser: function (user, take, skip, callback) {
        Message.find({username: {$nin: user.blockedUsers}})
            .skip(skip)
            .limit(take)
            .sort({datePublished: -1})
            .select('username avatarUrl content datePublished likes.username')
            .exec(callback);
    },
    addLikeToMessage: function (id, username, callback) {
        Message.update(
            {_id: id},
            {$push: {likes: {username: username}}},
            {},
            callback);
    },
    getById: function (id, callback) {
        Message.findOne({_id: id}, callback);
    },
    checkIfAlreadyLiked: function (id, username, callback) {
        Message.findOne({_id: id, 'likes.$.username': username}, {}, {}, callback);
    }

};