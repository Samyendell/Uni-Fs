const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

const searchForItem = (searchTerm, categoryId, done) => {
    let sql = `
        SELECT DISTINCT i.*, u.first_name, u.last_name 
        FROM items i 
        JOIN users u ON i.creator_id = u.user_id 
    `;
    
    let params = [];
    let whereClauses = [];

    if (categoryId && categoryId.length > 0) {
        sql += ` JOIN item_categories ic ON i.item_id = ic.item_id `;
        whereClauses.push(`ic.category_id IN (${categoryId.map(() => '?').join(',')})`);
        params.push(...categoryId);
    }

    if (searchTerm) {
        whereClauses.push(`(i.name LIKE ? OR i.description LIKE ?)`);
        const param = `%${searchTerm}%`;
        params.push(param, param);
    }

    if (whereClauses.length > 0) {
        sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    sql += ` ORDER BY i.start_date DESC`;

    db.all(sql, params, (err, rows) => {
        done(err, rows);
    });
};

const createItem = (itemData, done) => { 
    const sql = `INSERT INTO items (name, description, starting_bid, start_date, end_date, creator_id) VALUES (?, ?, ?, ?, ?, ?)`;
    let values = [itemData.name, itemData.description, itemData.starting_bid, itemData.start_date, itemData.end_date, itemData.creator_id];
    
    db.run(sql, values, function (err) {
        if (err) return done(err)
        return done(false, this.lastID)
    });
};

const getItem = (itemId, done) => {
    const sql = `SELECT * FROM items WHERE item_Id=?`;
    
    db.get(sql, [itemId], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);
        return done(false, row);
    });
};

const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id=?';
    
    db.get(sql, [id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);
        return done(false, row.session_token)
    })
}

const bidOnItem = (bidData, done) => {
    const sql = `INSERT INTO bids (item_id, user_id, amount, timestamp) VALUES (?, ?, ?, ?)`;
    let values = [bidData.itemId, bidData.userId, bidData.amount, bidData.timestamp];
    
    db.run(sql, values, (err) => {
        if (err) return done(err);
        return done(false);
    });
};

const getBidHistory = (itemId, done) => {
    const sql = `SELECT * FROM bids WHERE item_id = ? ORDER BY timestamp DESC`;
    
    db.all(sql, [itemId], (err, rows) => {
        if (err) return done(err);
        return done(false, rows)
    });
};

module.exports = {
    searchForItem,
    createItem,
    getItem,
    bidOnItem,
    getBidHistory
};