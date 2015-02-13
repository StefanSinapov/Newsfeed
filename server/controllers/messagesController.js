'use strict';

var data = require('../data/');
var DEFAULT_PAGE_SIZE = 20;

module.exports = {
    createMessage: function (req, res, next) {
        //POST /api/messages

        //TODO: validate
        data.users.findByUsername(req.user.username, function (err, currentUser) {
            if (err) {
                console.log('Failed to find user ' + err);
                res.status(400);
                res.send({reason: 'Failed to find user'});
                return;
            }

            var newMessage = {
                username: currentUser.username,
                avatarUrl: currentUser.avatarUrl,
                content: req.body.content
            };

            data.messages.create(newMessage, function (err, data) {
                if (err) {
                    res.status(400);
                    res.send({reason: 'Failed to create new message'});
                    return;
                }

                //TODO: add socket functions
                res.status(200);
                res.send({
                    id: data._id,
                    datePublished: data.datePublished
                });
            });
        });
    },
    getMessages: function (req, res, next) {
        var currentUser = req.user;
        var skip = req.query.skip || 0;

        data.users.findByUsername(currentUser.username, function(err, user){
            if(err){
                res.status(400).send({reason: 'Failed to find user ' + err});
            }

            data.messages.getMessagesForUser(user, DEFAULT_PAGE_SIZE, skip, function(err, messages){
                if(err){
                    res.status(400).send({reason: 'Failed to get messages for user: ' + currentUser.username});
                }

                res.status(200).send(messages);
            });
        });
    },
    likeMessage: function (req, res, next) {
        var currentUser = req.user;
        var messageId = req.params.id;

        //TODO: validate
        data.messages.addLikeToMessage(messageId, currentUser.username, function (err, message) {
            if (err) {
                console.log('Failed to add like to message' + err);
                res.status(400);
                res.send({reason: 'Failed to like message'});
                return;
            }

            data.users.addLikesPoints(message.username, function (err, user) {
                if (err) {
                    console.log('Failed to increase likes points ' + err);
                    res.status(400);
                    res.send({reason: 'Failed to increase likes points of creator'});
                    return;
                }

                res.status(200);
                res.send({reason: 'Message liked successfully'});
            });
        });
    }
};