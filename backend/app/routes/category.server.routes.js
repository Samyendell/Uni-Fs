const categories = require('../controllers/category.server.controllers');

module.exports = function(app) {
    app.route('/categories')
        .get(categories.getCategories);
};