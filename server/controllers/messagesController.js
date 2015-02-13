'use strict';

var data = require('../data/');

module.exports = {
    createMessage: function (req, res, next) {
        //POST /api/messages

        data.users.findByUsername(req.user.username, function (err, data) {
            if (err) {
                console.log('Failed to find user ' + err);
                res.status(400);
                res.send({reason: 'Failed to find user'});
                return;
            }

            var newMessage = {
                username: data.username,
                avatarUrl: data.avatarUrl,
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

    },
    likeMessage: function (req, res, next) {

    }
};