const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

const searchForItem = (searchTerm, done) => {
    if (!searchTerm) {
        const sql = `
            SELECT i.*, u.first_name, u.last_name 
            FROM items i 
            JOIN users u ON i.creator_id = u.user_id 
            ORDER BY i.start_date DESC
        `;

        db.all(sql, [], (err, rows) => {
            done(err, rows);
        });

    } else {
        const sql = `
            SELECT i.*, u.first_name, u.last_name 
            FROM items i 
            JOIN users u ON i.creator_id = u.user_id 
            WHERE i.name LIKE ? OR i.description LIKE ? 
            ORDER BY i.start_date DESC
        `;

        const param = `%${searchTerm}%`;

        db.all(sql, [param, param], (err, rows) => {
            done(err, rows);
        });
    }
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
