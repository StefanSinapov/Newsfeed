var users = require('../data/users');

module.exports = {
    getAllMembers: function(req, res) {

    },
    getMemberDetails: function(req, res) {
        users.getUserDetails(req.params.name, function (err, user) {
            res.status(200);

            if (user) {
                res.send(user);
            } else {
                res.send({ message: "No such user", isNull: true });
            }
        });
    }
};