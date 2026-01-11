const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

const getAllCategories = (done) => {
    const sql = `SELECT * FROM categories ORDER BY name ASC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) return done(err);
        return done(false, rows);
    });
};

const getCategoryById = (categoryId, done) => {
    const sql = `SELECT * FROM categories WHERE category_id = ?`;
    
    db.get(sql, [categoryId], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);
        return done(false, row);
    });
};

const addItemCategories = (itemId, categoryId, done) => {
    if (!categoryId || categoryId.length === 0) {
        return done(false);
    }

    const sql = `INSERT INTO item_categories (item_id, category_id) VALUES (?, ?)`;
    let count = 0;
    
    categoryId.forEach(catId => {
        db.run(sql, [itemId, catId], (err) => {
            if (err) return done(err);
            
            count++;
            if (count === categoryId.length) {
                return done(false);
            }
        });
    });
};

const getItemCategories = (itemId, done) => {
    const sql = `
        SELECT c.* 
        FROM categories c
        JOIN item_categories ic ON c.category_id = ic.category_id
        WHERE ic.item_id = ?
        ORDER BY c.name ASC
    `;
    
    db.all(sql, [itemId], (err, rows) => {
        if (err) return done(err);
        return done(false, rows);
    });
};

module.exports = {
    getAllCategories,
    getCategoryById,
    addItemCategories,
    getItemCategories,
};