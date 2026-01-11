const core = require('../controllers/core.server.controllers')
const auth = require('../lib/authentication')

module.exports = function (app) {

    app.route('/search')
        .get(core.searchForItem);

    app.route('/item')
        .post(auth.isAuthenticated, core.createItem);

    app.route('/item/:item_id')
        .get(core.getItem);

    app.route('/item/:item_id/bid')
        .post(auth.isAuthenticated, core.bidOnItem)
        .get(core.getBidHistory);
};