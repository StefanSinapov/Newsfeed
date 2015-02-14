var users = require('../data/users');

module.exports = {
    getAllMembers: function(req, res) {

    },
    getMemberDetails: function(req, res) {
        users.getUserDetails(req.params.name, function (err, user) {
            res.status(200);
            res.send(user);
        });
    }
};