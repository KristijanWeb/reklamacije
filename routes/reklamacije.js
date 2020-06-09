const express = require('express');
const app = express();
const router = express.Router();
const db = require('../config/db');

// Index
router.get('/reklamacije', (req, res, next) => {
    const username = req.session.username;

    if(username){
        res.render('reklam/reklamacije', {
            username: username
        });
    }
    else {
        res.redirect('/users')
    }

});

// Create GET
router.get('/reklam-create', (req, res, next) => {
    res.redirect('/');
});

// Create POST
router.post('/reklam-create', (req, res, next) => {
    const nazivuredaja = req.body.nazivuredaja;
    const markauredaja = req.body.markauredaja;
    const greska = req.body.greska;
    const donjeo = req.body.donjeo;
    const broj = req.body.broj;
    const garancijaracun = req.body.garancijaracun;

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    let vrijeme = month + "." + date + "." + year;

    const sql = `INSERT INTO reklamacije (nazivuredaja, markauredaja, greska, donjeo, broj, garancijaracun, vrijeme) 
                VALUES ('${nazivuredaja}', '${markauredaja}', '${greska}', '${donjeo}', '${broj}', '${garancijaracun}', '${vrijeme}')`;
    db.query(sql, (err, data) => {
        if (err) throw err;
    });

    res.redirect('/users/profile')
});

module.exports = router;