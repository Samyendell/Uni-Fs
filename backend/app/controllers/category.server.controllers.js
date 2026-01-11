const category = require('../models/category.server.model');

const getCategories = (req, res) => {
    category.getAllCategories((err, categories) => {
        if (err) {
            return res.status(500).json({ error_message: "Database error" });
        }
        
        return res.status(200).json(categories);
    });
};

module.exports = {
    getCategories
};