const express = require('express');
const app = express();
const router = express.Router();
const db = require('../config/db');

// Index
router.get('/', (req, res, next) => {
    const username = req.session.username;
    res.render('index', {
        username: username
    });
});

module.exports = router;