'use strict';

var mongoose = require('mongoose');

var Message;

module.exports.init = function () {
    var messageSchema = mongoose.Schema({
        username: {type: String, require: "{PATH} is required"},
        avatarUrl: String,
        content: String,
        datePublished: {type: Date, default: Date.now},
        Likes: [{
            username: String,
            isCreatorNotified: {type: Boolean, default: false}
        }]
    });

    //Todo: reverse order of date
    messageSchema.index({username: 1, date: -1});

    Message = mongoose.model('Message', messageSchema);
};