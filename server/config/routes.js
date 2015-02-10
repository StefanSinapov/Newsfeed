'use strict';

var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function (app) {

    // Users
    app.route('/api/users')
        .get(controllers.users.getAllUsers)
        .post(controllers.users.createUser);
    /*.put(auth.isAuthenticated, controllers.users.updateUser);*/

    app.post('/login', auth.login);
    app.post('/logout', auth.logout);

    app.get('/partials/:partialArea/:partialName', function (req, res) {
        res.render('../../public/app/' + req.params.partialArea + '/' + req.params.partialName);
    });

    app.get('/api/*', function (req, res) {
        res.render('index');
        res.status(404);
        res.end();
    });

    app.get('*', function (req, res) {
        res.render('index', { currentUser: req.user });
    });
};