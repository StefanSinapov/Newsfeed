'use strict';

var fs = require("fs");
/*var formidable = require('formidable');*/
var encryption = require('../utilities/encryption');
var User = require('mongoose').model('User');
var DEFAULT_PAGE_SIZE = 10;
var DEFAULT_UPLOAD_DIRECTORY = './public/images';
var DEFAULT_AVATAR = 'default-avatar.jpg';

var getImageGuid = function (image) {
    var guidIndex = image.path.lastIndexOf('/');
    if (guidIndex < 0) {
        var guidIndex = image.path.lastIndexOf('\\');
    }

    var guid = image.path.substring(guidIndex + 1);
    return guid;
};

module.exports = {
    createUser: function (req, res, next) {
        var newUserData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            phone: req.body.phone,
            city: req.body.city,
            imageUrl: DEFAULT_AVATAR
        };

        newUserData.salt = encryption.generateSalt();
        newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, req.body.password);
        newUserData.roles = ['user'];

        User.create(newUserData, function (err, user) {
            if (err) {
                console.log('Failed to register new user: ' + err);
                res.status(400);
                res.send(false);
                return;
            }

            req.logIn(user, function (err) {
                if (err) {
                    res.status(400);
                    return res.send({ reason: err.toString() });
                }

                res.send(user);
            });
        });
    },
    /*updateUser: function (req, res, next) {

        if (!fs.existsSync(DEFAULT_UPLOAD_DIRECTORY)) {
            fs.mkdirSync(DEFAULT_UPLOAD_DIRECTORY);
        }

        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = DEFAULT_UPLOAD_DIRECTORY;
        form.keepExtensions = true;

        form.parse(req, function (err, fields, files) {

            User.findOne({ _id: fields._id }).exec(function (err, user) {
                if (err || !user) {
                    res.status(400).send('Error updating user: ' + err);
                    return;
                }

                user.firstName = fields.firstName;
                user.lastName = fields.lastName;
                user.phone = fields.phone;
                user.city = fields.city;

                if (files.image) {

                    if (process.env.NODE_ENV) {
                        return res.status(403).send({message: 'Changing profile photos has been disabled for security reasons!'});
                    }

                    // removes the old image
                    var oldImagePath = DEFAULT_UPLOAD_DIRECTORY + '/' + user.imageUrl;
                    if (user.imageUrl !== DEFAULT_AVATAR && fs.existsSync(oldImagePath)) {
                        fs.unlink(oldImagePath);
                    }

                    // set the new imageUrl
                    var newImageGuid = getImageGuid(files.image);
                    user.imageUrl = newImageGuid;
                }

                if (fields.password && fields.password.length > 5) {
                    user.salt = encryption.generateSalt();
                    user.hashPass = encryption.generateHashedPassword(user.salt, fields.password);
                }

                user.save(function (err, updatedUser, numberAffected) {
                    if (err) {
                        res.status(400).send('Error updating user: ' + err);
                        return;
                    }

                    res.status(200).send('User updated successfully!');
                });
            });
        });
    },*/
    getAllUsers: function (req, res, next) {

        var page = Math.max(req.query.page, 1);
        var orderType = req.query.orderType === 'desc' ? '-' : '';
        var username = req.query.username || '';
        var firstName = req.query.firstName || '';
        var lastName = req.query.lastName || '';


        User.find({})
            .where({ username: new RegExp(username, "i") })
            .where({ firstName: new RegExp(firstName, "i") })
            .where({ lastName: new RegExp(lastName, "i") })
            .skip(DEFAULT_PAGE_SIZE * (page - 1))
            .limit(DEFAULT_PAGE_SIZE)
            //.sort(orderType + 'rank')
            .select('_id username firstName lastName imageUrl')//city phone roles items
            .exec(function (error, result) {
                if (error) {
                    res.status(400);
                    res.send(error);
                } else {
                    res.send(result);
                }
            });
    },
    getById: function (req, res, next) {
        User
            .findOne({ _id: req.params.id })
            .select('_id username firstName lastName imageUrl city phone roles items')
            .exec(function (err, item) {
                if (err) {
                    res.status(400).send('User could not be found: ' + err);
                    console.log('User could not be found: ' + err);
                    return;
                }

                res.send(item);
            });
    },
    deleteUser: function (req, res, next) {
        // Allowed for admins
        User
            .findOne({ _id: req.params.id })
            .remove()
            .exec(function (err, count) {
                if (err) {
                    res.status(400).send('User could not be found: ' + err);
                    console.log('User could not be found: ' + err);
                    return;
                }

                res.status(200).send("User deleted successfully");
            });
    },
    updateByAdmin: function (req, res, next) {

        var updatedUserData = {
            _id: req.body._id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            city: req.body.city
        };

        if (req.body.password && req.body.password.length > 5) {
            updatedUserData.salt = encryption.generateSalt();
            updatedUserData.hashPass = encryption.generateHashedPassword(updatedUserData.salt, req.body.password);
        }

        User.update({ _id: req.body._id }, updatedUserData, function (err, numberAffectedRows) {
            if (err) {
                res.status(400).send('Error updating user data: ' + err);
                return;
            }
            res.status(200).send('User updated successfully');
        });
    },
    makeAdmin: function (req, res, next) {
        User
            .findOne({ _id: req.params.id })
            .exec(function (err, user) {

                if (err) {
                    console.log('User cannot be found: ' + err);
                    res.status(404);
                    res.send('User cannot be found: ' + err);
                    return;
                }

                if (user.roles.indexOf('admin') >= 0) {
                    res.send('User is already admin');
                }
                else {

                    user.roles.push('admin');

                    user.save(function (err, user) {
                        if (err) {
                            res.status(400);
                            res.send('User cannot be changed: ' + err);
                            return;
                        }

                        res.send('User updated successfully');
                    });
                }
            });
    }
};