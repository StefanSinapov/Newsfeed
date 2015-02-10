'use strict';

var mongoose = require('mongoose'),
    Models = require('../data/models');

module.exports = function (config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.once('open', function (err) {
        if (err) {
            console.log('Database could not be opened: ' + err);
            return;
        }

        console.log('Database up and running...');
    });

    db.on('error', function (err) {
        console.log('Database error: ' + err);
    });

    //Todo: init data here after creating

    Models.User.init();

    /*Models.Message.init();
    Models.User.init();
    Models.Category.init();

    Models.Category.seedCategories();*/
};