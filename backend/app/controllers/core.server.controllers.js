const Joi = require("joi");
const core = require('../models/core.server.model');
const users = require('../models/user.server.model');
const categoryModel = require('../models/category.server.model');
const profanityFilter = require('../lib/profanityFilter');

const searchForItem = (req, res) => {
    const schema = Joi.object({
        q: Joi.string().allow('').optional(),
        status: Joi.string().valid('BID', 'OPEN', 'ARCHIVE').optional(),
        category: Joi.array().items(Joi.number().integer().min(1)).optional(),
        limit: Joi.number().min(1).max(100).default(20),
        offset: Joi.number().min(0).default(0)
    });

    const { error } = schema.validate(req.query);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    const { q, status, category, limit = 20, offset = 0 } = req.query;
    const token = req.get('X-Authorization');

    if (q && profanityFilter.isProfane(q)) {
        return res.status(400).json({
            error_message: "Search contains inappropriate language"
        });
    }
    
    let categoryId = null;
    if (category && category.length > 0) {
        categoryId = category.map(Number);
    }

    if (status && ['BID', 'OPEN', 'ARCHIVE'].includes(status)) {
        if (!token) {
            return res.status(400).json({ error_message: "Authentication required for status filter" });
        }

        users.getIdFromToken(token, (err, userId) => {
            if (err || userId === null) {
                return res.status(401).json({ error_message: "Unauthorized" });
            }

            searchWithStatus(q, status, userId, categoryId, limit, offset, res);
        });
    } else {
        searchBasic(q, categoryId, limit, offset, res);
    }
};

const searchBasic = (searchTerm, categoryId, limit, offset, res) => {
    core.searchForItem(searchTerm, categoryId, (err, items) => {
        if (err) {
            return res.status(500).json({ error_message: "Database error" });
        }

        const paginatedItems = items.slice(offset, offset + limit);
        res.status(200).json(paginatedItems);
    });
};

const searchWithStatus = (searchTerm, status, userId, categoryId, limit, offset, res) => {
    const currentTime = Date.now();

    switch (status) {
        case 'BID':
            users.getUserActiveBids(userId, (err, activeBids) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                users.getUserEndedAuctions(userId, (err, endedBids) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    let allBids = [...activeBids, ...endedBids];

                    if (searchTerm) {
                        allBids = allBids.filter(item =>
                            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    }

                    const paginatedItems = allBids.slice(offset, offset + limit);
                    res.status(200).json(paginatedItems);
                });
            });
            break;

        case 'OPEN':
            users.getUserItems(userId, (err, userItems) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                let openItems = userItems.filter(item => item.end_date > currentTime);

                if (searchTerm) {
                    openItems = openItems.filter(item =>
                        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                const paginatedItems = openItems.slice(offset, offset + limit);
                res.status(200).json(paginatedItems);
            });
            break;

        case 'ARCHIVE':
            users.getUserItems(userId, (err, userItems) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                let archivedItems = userItems.filter(item => item.end_date <= currentTime);

                if (searchTerm) {
                    archivedItems = archivedItems.filter(item =>
                        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                const paginatedItems = archivedItems.slice(offset, offset + limit);
                res.status(200).json(paginatedItems);
            });
            break;

        default:
            return res.status(400).json({ error_message: "Invalid status parameter" });
    }
};

const createItem = (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        starting_bid: Joi.number().integer().min(1).required(),
        end_date: Joi.number().integer().min(Date.now()).required(),
        category_id: Joi.array().items(Joi.number().integer().min(1)).optional()
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    if (profanityFilter.isProfane(req.body.name) || profanityFilter.isProfane(req.body.description)) {
        return res.status(400).json({
            error_message: "Item contains inappropriate language and cannot be created"
        });
    }

    const token = req.get('X-Authorization');
    users.getIdFromToken(token, (err, userId) => {
        if (err || userId === null) {
            return res.status(401).json({ error_message: "Unauthorized" });
        }

        const itemData = {
            name: req.body.name,
            description: req.body.description,
            starting_bid: req.body.starting_bid,
            start_date: Date.now(),
            end_date: req.body.end_date,
            creator_id: userId
        };

        core.createItem(itemData, (err, itemId) => {
            if (err) {
                return res.status(500).json({ error_message: "Database error" });
            }

            if (req.body.category_id && req.body.category_id.length > 0) {
                categoryModel.addItemCategories(itemId, req.body.category_id, (err) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error adding categories" });
                    }

                    res.status(201).json({
                        item_id: itemId
                    });
                });
            } else {
                res.status(201).json({
                    item_id: itemId
                });
            }
        });
    });
}

const getItem = (req, res) => {
    const schema = Joi.object({
        item_id: Joi.number().integer().min(1).required()
    })

    const { error } = schema.validate(req.params);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    const itemId = req.params.item_id;

    core.getItem(itemId, (err, item) => {
        if (err) {
            if (err === 404) {
                return res.status(404).json({ error_message: "Item not found" });
            }
            return res.status(500).json({ error_message: "Database error" });
        }

        users.getProfileInformation(item.creator_id, (err, creator) => {
            if (err) {
                return res.status(500).json({ error_message: "Database error" });
            }

            core.getBidHistory(itemId, (err, bids) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                categoryModel.getItemCategories(itemId, (err, categories) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    const itemResponse = {
                        item_id: item.item_id,
                        name: item.name,
                        description: item.description,
                        starting_bid: item.starting_bid,
                        start_date: item.start_date,
                        end_date: item.end_date,
                        creator_id: item.creator_id,
                        first_name: creator.first_name,
                        last_name: creator.last_name
                    };

                    if (categories && categories.length > 0) {
                        itemResponse.categories = categories;
                    }

                    if (!bids || bids.length === 0) {
                        itemResponse.current_bid = item.starting_bid;
                        itemResponse.current_bid_holder = null;
                        return res.status(200).json(itemResponse);
                    }

                    const highestBid = bids[0];
                    itemResponse.current_bid = highestBid.amount;

                    users.getProfileInformation(highestBid.user_id, (err, bidHolder) => {
                        if (err) {
                            return res.status(500).json({ error_message: "Database error" });
                        }

                        itemResponse.current_bid_holder = {
                            user_id: highestBid.user_id,
                            first_name: bidHolder.first_name,
                            last_name: bidHolder.last_name
                        };

                        return res.status(200).json(itemResponse);
                    });
                });
            });
        });
    });
}

const bidOnItem = (req, res) => {
    const paramsSchema = Joi.object({
        item_id: Joi.number().integer().min(1).required()
    });

    const bodySchema = Joi.object({
        amount: Joi.number().integer().min(1).required()
    });

    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) return res.status(400).json({ error_message: paramsError.details[0].message });

    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) return res.status(400).json({ error_message: bodyError.details[0].message });

    const itemId = req.params.item_id;
    const amount = req.body.amount;
    const token = req.get('X-Authorization');

    users.getIdFromToken(token, (err, userId) => {
        if (err || userId === null) {
            return res.status(401).json({ error_message: "Unauthorized" });
        }

        core.getItem(itemId, (err, item) => {
            if (err) {
                if (err === 404) {
                    return res.status(404).json({ error_message: "Item not found" });
                }
                return res.status(500).json({ error_message: "Database error" });
            }

            if (userId === item.creator_id) {
                return res.status(403).json({ error_message: "You cannot bid as the seller on this item" });
            }

            core.getBidHistory(itemId, (err, items) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                let currentBid = item.starting_bid;

                if (items && items.length > 0) {
                    currentBid = items[0].amount;
                }

                if (amount <= currentBid) {
                    return res.status(400).json({ error_message: "amount less or equal than current bid" });
                }

                const bidData = {
                    itemId: itemId,
                    userId: userId,
                    amount: amount,
                    timestamp: Date.now()
                };

                core.bidOnItem(bidData, (err) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    return res.status(201).json({
                        amount: amount,
                    });
                });
            });
        });
    })
}

const getBidHistory = (req, res) => {
    const paramsSchema = Joi.object({
        item_id: Joi.number().integer().min(1).required()
    });

    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) return res.status(400).json({ error_message: paramsError.details[0].message });

    const itemId = parseInt(req.params.item_id);

    core.getItem(itemId, (err) => {
        if (err) {
            if (err === 404) {
                return res.status(404).json({ error_message: "Item not found" });
            }
            return res.status(500).json({ error_message: "Database error" });
        }

        core.getBidHistory(itemId, (err, items) => {
            if (err) {
                return res.status(500).json({ error_message: "Database error" });
            }

            if (!items || items.length === 0) {
                return res.status(200).json([]);
            }

            let bidHistoryData = new Array(items.length);
            let completed = 0;

            items.forEach((bid, index) => {
                users.getProfileInformation(bid.user_id, (err, user) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    bidHistoryData[index] = {
                        item_id: itemId,
                        amount: bid.amount,
                        timestamp: bid.timestamp,
                        user_id: bid.user_id,
                        first_name: user.first_name,
                        last_name: user.last_name
                    };

                    completed++;

                    if (completed === items.length) {
                        return res.status(200).json(bidHistoryData);
                    }
                });
            });
        });
    });
};

module.exports = {
    searchForItem: searchForItem,
    createItem: createItem,
    getItem: getItem,
    bidOnItem: bidOnItem,
    getBidHistory: getBidHistory
};