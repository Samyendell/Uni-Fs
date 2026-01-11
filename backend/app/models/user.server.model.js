const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const db = new sqlite3.Database('./db.sqlite');

const createAccount = (userData, done) => {
    const sql = `INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [userData.first_name, userData.last_name, userData.email, userData.password_hash, userData.salt], function (err) {
        done(err, this ? this.lastID : null);
    });
};

const doesEmailExist = (email, done) => {
    const sql = 'SELECT user_id FROM users WHERE email = ?';

    db.get(sql, [email], (err, row) => {
        done(err, row ? true : false);
    });
};

const getHash = function (password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
}

const addNewUser = (user, done) => {
    doesEmailExist(user.email, (err, exists) => {
        if (err) return done(err);
        if (exists) return done(new Error('Email already exists'));

        const salt = crypto.randomBytes(64);
        const hash = getHash(user.password, salt);

        const sql = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)';
        let values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex')];

        db.run(sql, values, function (err) {
            if (err) return done(err)
            return done(false, this.lastID);
        })
    })
}

const authenticateUser = (email, password, done) => {
    const sql = 'SELECT user_id, password, salt FROM users WHERE email=?';

    db.get(sql, [email], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);

        if (row.salt === null) row.salt = ''

        let salt = Buffer.from(row.salt, 'hex');

        if (row.password === getHash(password, salt)) {
            return done(false, row.user_id)
        } else {
            return done(404)
        }
    })
}

const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id=?';

    db.get(sql, [id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);
        return done(false, row.session_token)
    })
}

const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');

    const sql = 'UPDATE users SET session_token=? WHERE user_id=?'

    db.run(sql, [token, id], (err) => {
        return done(err, token)
    })
}

const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token=null WHERE session_token=?'

    db.run(sql, [token], (err) => {
        return done(err)
    })
}

const getIdFromToken = (token, done) => {
    const sql = 'SELECT user_id FROM users WHERE session_token=?'

    db.get(sql, [token], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);

        return done(false, row.user_id);
    })
}

const login = (username, done) => {
    const sql = `SELECT * FROM users WHERE username=?`;

    db.get(sql, [username], (err, row) => {
        done(err, row);
    });
};

const getProfileInformation = (userId, done) => {
    const sql = `SELECT user_id, first_name, last_name FROM users WHERE user_id=?`;

    db.get(sql, [userId], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);
        return done(false, row);
    });
};

const getUserItems = (userId, done) => {
    const sql = `
        SELECT i.item_id, i.name, i.description, i.end_date, i.creator_id, u.first_name, u.last_name
        FROM items i 
        JOIN users u ON i.creator_id = u.user_id
        WHERE i.creator_id = ?
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) return done(err);
        return done(false, rows);
    });
};

const getUserActiveBids = (userId, done) => {
    const currentTime = Date.now();

    const sql = `
        SELECT i.item_id, i.name, i.description, i.starting_bid, i.start_date, i.end_date, i.creator_id, u.first_name, u.last_name,
            MAX(b.amount) as user_bid_amount
        FROM items i 
        JOIN bids b ON i.item_id = b.item_id 
        JOIN users u ON i.creator_id = u.user_id
        WHERE b.user_id = ? 
        AND i.end_date > ?
        GROUP BY i.item_id, i.name, i.description, i.starting_bid, i.start_date, i.end_date, i.creator_id, u.first_name, u.last_name
        ORDER BY i.end_date ASC
    `;

    db.all(sql, [userId, currentTime], (err, rows) => {
        if (err) return done(err);
        return done(false, rows);
    });
};

const getUserEndedAuctions = (userId, done) => {
    const currentTime = Date.now();

    const sql = `
        SELECT i.item_id, i.name, i.description, i.starting_bid, i.start_date, i.end_date, i.creator_id, u.first_name, u.last_name, 
            MAX(b.amount) as highest_bid
        FROM items i 
        JOIN users u ON i.creator_id = u.user_id
        LEFT JOIN bids b ON i.item_id = b.item_id
        WHERE i.creator_id = ? 
        AND i.end_date <= ?
        GROUP BY i.item_id, i.name, i.description, i.starting_bid, i.start_date, i.end_date, i.creator_id, u.first_name, u.last_name
        ORDER BY i.end_date DESC
    `;

    db.all(sql, [userId, currentTime], (err, rows) => {
        if (err) return done(err);
        return done(false, rows);
    });
};

module.exports = {
    createAccount,
    doesEmailExist,
    login,
    addNewUser,
    authenticateUser,
    getToken,
    setToken,
    removeToken,
    getIdFromToken,
    getProfileInformation,
    getUserItems,
    getUserActiveBids,
    getUserEndedAuctions
};
