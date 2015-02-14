'use strict';

var usersController = require('../controllers/usersController');
var messagesController = require('../controllers/messagesController');
var membersController = require('../controllers/membersController');

module.exports = {
    users: usersController,
    messages: messagesController,
    members: membersController
};