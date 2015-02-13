'use strict';

var usersController = require('../controllers/usersController');
var messagesController = require('../controllers/messagesController');

module.exports = {
    users: usersController,
    messages: messagesController
};