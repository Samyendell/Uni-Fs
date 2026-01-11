const Joi = require("joi");
const users = require("../models/user.server.model");

const create_account = (req, res) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(8)
            .max(20)
            .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])'))
            .required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    };

    users.addNewUser(userData, (err, userId) => {
        if (err) {
            if (err.message === 'Email already exists') {
                return res.status(400).json({ error_message: "Email already exists" });
            }
            return res.status(500).json({ error_message: "Database error" });
        }

        res.status(201).json({
            user_id: userId
        });
    });
}

const login = (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    users.authenticateUser(req.body.email, req.body.password, (err, id) => {
        if (err === 404) return res.status(400).json({ error_message: "Invalid email/password supplied" });
        if (err) return res.status(500).json({ error_message: "Server error" });

        users.getToken(id, (err, token) => {
            if (err) return res.status(500).json({ error_message: "Token generation failed" });

            if (token) {
                return res.status(200).json({
                    user_id: id,
                    session_token: token
                });
            } else {
                users.setToken(id, (err, token) => {
                    if (err) return res.sendStatus(500);
                    return res.status(200).json({ user_id: id, session_token: token })
                })
            }
        })
    })
}

const logout = (req, res) => {
    const token = req.get('X-Authorization');

    if (!token) {
        return res.status(401).json({ error_message: "No token provided" });
    }

    users.removeToken(token, (err) => {
        if (err) {
            return res.status(500).json({ error_message: "Database error" });
        }

        return res.status(200).json({ message: "Logged out successfully" });
    })
}

const getProfileInfomation = (req, res) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().min(1).required()
    })

    const { error } = schema.validate(req.params);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    const userId = parseInt(req.params.user_id);

    users.getProfileInformation(userId, (err, user) => {
        if (err) {
            if (err === 404) {
                return res.status(404).json({ error_message: "User not found" });
            }
            return res.status(500).json({ error_message: "Database error" });
        }

        users.getUserItems(userId, (err, items) => {
            if (err) {
                return res.status(500).json({ error_message: "Database error" });
            }

            users.getUserActiveBids(userId, (err, activeBids) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                users.getUserEndedAuctions(userId, (err, endedBids) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    const profileData = {
                        user_id: user.user_id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        selling: items || [],
                        bidding_on: activeBids || [],
                        auctions_ended: endedBids || []
                    };

                    res.status(200).json(profileData);
                });
            });
        });
    });
}

const getItem = (req, res) => {
    const schema = Joi.object({
        item_id: Joi.number().integer().min(1).required(),
    })

    const { error } = schema.validate(req.params);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    const itemId = parseInt(req.params.item_id);

    core.getItem(itemId, (err, item) => {
        if (err) {
            if (err === 404) {
                return res.status(404).json({ error_message: "Item not found" });
            }
            return res.status(500).json({ error_message: "Database error" });
        }

        res.status(200).json(item);
    });
}

module.exports = {
    create_account: create_account,
    login: login,
    logout: logout,
    getProfileInfomation: getProfileInfomation
};