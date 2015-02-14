'use strict';

var data = require('../data/');
var clients = require('../config/socket').clients;
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

                for(var client in clients){
                    clients[client].emit('newMessage', data);
                }

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

        data.users.findByUsername(currentUser.username, function (err, user) {
            if (err) {
                res.status(400).send({reason: 'Failed to find user ' + err});
            }

            data.messages.getMessagesForUser(user, DEFAULT_PAGE_SIZE, skip, function (err, messages) {
                if (err) {
                    res.status(400).send({reason: 'Failed to get messages for user: ' + currentUser.username});
                }

                res.status(200).send(messages);
            });
        });
    },
    likeMessage: function (req, res, next) {
        var currentUser = req.user;
        var messageId = req.params.id;

        data.messages.getById(messageId, function (err, message) {
            if (err) {
                console.log('Failed to add like to message' + err);
                res.status(400);
                res.send({reason: 'Failed to like message'});
                return;
            }

            if (message.username === currentUser.username) {
                res.status(400).send({reason: 'Не може сам да си харесваш мисълта'});
                return;
            }

            var alreadyLiked = false;
            message.likes.map(function (like) {
                if (like.username === currentUser.username) {
                    alreadyLiked = true;
                }
            });

            if (alreadyLiked) {
                res.status(400).send({reason: 'Вече си харесал таз мисъл'});
                return;
            }

            message.likes.push({username: currentUser.username});
            message.save();

            data.users.addLikesPoints(message.username, function (err, user) {
                if (err) {
                    console.log('Failed to increase likes points ' + err);
                    res.status(400);
                    res.send({reason: 'Failed to increase likes points of creator'});
                    return;
                }

                data.users.calculateRankPoints(message.username);

                res.status(200);
                res.send({reason: 'Message liked successfully'});
            });
        });
    }
};