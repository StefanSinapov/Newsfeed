'use strict';

var fs = require("fs");
var formidable = require('formidable');
var encryption = require('../utilities/encryption');
var clients = require('../config/socket').clients;
var users = require('../data/users');
var messages = require('../data/messages');
var DEFAULT_UPLOAD_DIRECTORY = './public/images';
var DEFAULT_AVATAR = 'default-avatar.jpg';
var UNDEFINED = "undefined";


var getImageGuid = function (image) {
    var guidIndex = image.path.lastIndexOf('/');
    if (guidIndex < 0) {
        guidIndex = image.path.lastIndexOf('\\');
    }

    return image.path.substring(guidIndex + 1);
};

module.exports = {
    createUser: function (req, res, next) {
        if (!req.body.password || !req.body.confirmPassword) {
            res.status(400);
            return res.send({reason: "Паролата липсва!"});
        }

        if (req.body.password !== req.body.confirmPassword) {
            res.status(400);
            res.send({reason: "Двете пароли трябва да са еднакви!"});
            return;
        }

        // TODO: Add validation
        var newUserData = {
            username: req.body.username,
            email: req.body.email
        };

        newUserData.roles = ["standard"]; // In order to avoid JSON injection for roles

        newUserData.salt = encryption.generateSalt();
        newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, req.body.password);

        users.create(newUserData, function (err, user) {
            if (err) {
                console.log('Failed to register new user: ' + err);
                res.status(400);
                res.send({reason: err.toString()});
                return;
            }

            req.logIn(user, function (err) {
                if (err) {
                    res.status(400);
                    res.send({reason: err.toString()});
                    return;
                }

                res.send(user);
            });
        });
    },
    updateUser: function (req, res, next) {
        if (!fs.existsSync(DEFAULT_UPLOAD_DIRECTORY)) {
            fs.mkdirSync(DEFAULT_UPLOAD_DIRECTORY);
        }

        var isNewAvatar = false;
        var form = new formidable.IncomingForm();

        form.encoding = 'utf-8';
        form.uploadDir = DEFAULT_UPLOAD_DIRECTORY;
        form.keepExtensions = true;

        form.parse(req, function (err, fields, files) {
            users.findById(fields._id, function (err, user) {
                if (err || !user) {
                    res.status(400).send({reason: 'Error updating user: ' + err});
                    return;
                }
                
                if (fields.confirmPassword === UNDEFINED) {
                    res.status(400).send({ reason: "Няма парола за потвърждение!" });
                    return;
                }

                var hashPass = encryption.generateHashedPassword(user.salt, fields.confirmPassword);

                if (hashPass !== user.hashPass) {
                    res.status(400).send({reason: "Грешна парола за потвърждение!"});
                    return;
                }

                if (fields.password !== UNDEFINED && fields.repeatPassword !== UNDEFINED) {
                    if ((fields.password !== fields.repeatPassword) || fields.password.length < 6) {
                        res.status(400).send({reason: "Грешка при обработка на новата парола! Въведи отново."});
                        return;
                    } else {
                        user.salt = encryption.generateSalt();
                        user.hashPass = encryption.generateHashedPassword(user.salt, fields.password);

                        console.log(user.hashPass);
                    }
                }

                if (files.image) {

                    /* if (process.env.NODE_ENV) {
                     return res.status(403).send({reason: 'Changing profile photos has been disabled for security reasons!'});
                     }*/

                    // removes the old image
                    var oldImagePath = DEFAULT_UPLOAD_DIRECTORY + '/' + user.avatarUrl;
                    if (user.avatarUrl !== DEFAULT_AVATAR && fs.existsSync(oldImagePath)) {
                        fs.unlink(oldImagePath);
                    }

                    // set the new imageUrl
                    var newImageGuid = getImageGuid(files.image);
                    user.avatarUrl = newImageGuid;
                    isNewAvatar = true;
                }


                // TODO: Validation
                if (fields.email) {
                    user.email = fields.email;
                }

                user.save(function (err, updatedUser, numberAffected) {
                    var successObj = {
                        avatarUrl: updatedUser.avatarUrl,
                        email: updatedUser.email,
                        reason: "Профил ъпдейтнат!"
                    };

                    if (err) {
                        res.status(400).send({reason: 'Error updating user: ' + err});
                        return;
                    }

                    if (isNewAvatar) {
                        messages.updateAvatars(updatedUser.username, updatedUser.avatarUrl, function (err, updatedMessages) {
                            if (err) {
                                res.status(400).send({reason: 'Error updating messages ' + err});
                                return;
                            }

                            res.status(200).send(successObj);
                        });
                    }
                    else {
                        res.status(200).send(successObj);
                    }
                });
            });
        });
    },
    getAllUsers: function (req, res, next) {
        var username = req.query.username || '';
        users.getSortedByRank(username, function (err, users) {
            if (err) {
                console.log("Failed loading users");
                res.status(400).send({reason: "Failed loading users", error: err});
            }

            res.status(200).send(users);
        });
    },
    blockUser: function (req, res, next) {
        var currentUser = req.user;
        var blockedUsername = req.params.username;

        if (blockedUsername === currentUser.username) {
            res.status(400).send({reason: 'Не можеш сам да се скриеш'});
            return;
        }

        users.addBlockedUsername(currentUser.username, blockedUsername, function (err) {

            if (err) {
                console.log('Failed to add blocked username to collection ' + err);
                res.status(400);
                res.send({reason: 'Failed to add blocked username to collection'});
                return;
            }

            users.addBlockPoint(blockedUsername, function (err) {
                if (err) {
                    console.log('Failed to increase block points' + err);
                    res.status(400);
                    res.send({reason: 'Failed to increase block points'});
                    return;
                }

                users.calculateRankPoints(blockedUsername);

                if (clients[blockedUsername]) {
                    clients[blockedUsername].emit('blockNotification', {username: currentUser.username});
                }

                res.status(200);
                res.send({reason: blockedUsername + ' blocked successfully'});
            });
        });
    },
    unBlockUser: function (req, res, next) {
        var currentUser = req.user;
        var blockedUsername = req.params.username;

        users.removeBlockedUsername(currentUser.username, blockedUsername, function (err) {
            if (err) {
                console.log('Failed to remove blocked username from collection ' + err);
                res.status(400);
                res.send({reason: 'Failed to remove block'});
            }

            users.removeBlockPoint(blockedUsername, function (err) {
                if (err) {
                    console.log('Failed to decrease block points ' + err);
                    res.status(400);
                    res.send({reason: 'Failed to decrease block points'});
                    return;
                }

                users.calculateRankPoints(blockedUsername);

                if (clients[blockedUsername]) {
                    clients[blockedUsername].emit('unBlockNotification', {username: currentUser.username});
                }

                res.status(200);
                res.send({reason: blockedUsername + ' unblocked successfully'});
            });
        });
    }
};