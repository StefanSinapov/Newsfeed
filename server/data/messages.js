'use strict';

var Message = require('mongoose').model('Message');

module.exports = {
    create: function(message, callback){
        Message.create(message, callback);
    }
};