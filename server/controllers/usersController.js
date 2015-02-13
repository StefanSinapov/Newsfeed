'use strict';

var fs = require("fs");
var formidable = require('formidable');
var encryption = require('../utilities/encryption');
/*var User = require('mongoose').model('User');*/
var users = require('../data/users');
var messages = require('../data/messages');
/*var DEFAULT_PAGE_SIZE = 10;*/
var DEFAULT_UPLOAD_DIRECTORY = './public/images';
var DEFAULT_AVATAR = 'default-avatar.jpg';

var getImageGuid = function (image) {
    var guidIndex = image.path.lastIndexOf('/');
    if (guidIndex < 0) {
        guidIndex = image.path.lastIndexOf('\\');
    }

    return image.path.substring(guidIndex + 1);
};

module.exports = {
    createUser: function (req, res, next) {

        if(req.body.password !== req.body.confirmPassword){
            res.status(400);
            res.send({ reason: "Password and confirm password must be the same!"});
            return;
        }

        var newUserData = {
            username: req.body.username
        };

        newUserData.salt = encryption.generateSalt();
        newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, req.body.password);

        users.create(newUserData, function (err, user) {
            if (err) {
                console.log('Failed to register new user: ' + err);
                res.status(400);
                res.send({ reason: err.toString() });
                return;
            }

            req.logIn(user, function (err) {
                if (err) {
                    res.status(400);
                    res.send({ reason: err.toString() });
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

                if (fields.password && fields.password.length > 5) {
                    user.salt = encryption.generateSalt();
                    user.hashPass = encryption.generateHashedPassword(user.salt, fields.password);
                }

                user.save(function (err, updatedUser, numberAffected) {
                    if (err) {
                        res.status(400).send({reason: 'Error updating user: ' + err});
                        return;
                    }

                    if(isNewAvatar){
                        messages.updateAvatars(updatedUser.username, updatedUser.avatarUrl);
                    }

                    res.status(200).send({avatarUrl: updatedUser.avatarUrl, reason: 'User updated successfully!'});
                });
            });
        });
    },
    getAllUsers: function (req, res, next) {
        /*User.aggregate(
            { $project: {
                username:
            }}
        )
            //.skip(DEFAULT_PAGE_SIZE * (page - 1))
            //.limit(DEFAULT_PAGE_SIZE)
            //.sort(orderType + 'rank')
            .select('_id username avatarUrl, stats.likes, stats')//city phone roles items
            .exec(function (error, result) {
                if (error) {
                    res.status(400);
                    res.send(error);
                } else {
                    res.send(result);
                }
            });*/
    },
    blockUser: function(req, res, next){

    },
    unBlockUser: function(req, res, next){

    }
};