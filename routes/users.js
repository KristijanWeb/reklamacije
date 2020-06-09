const express = require('express');
const app = express();
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');

// Index
router.get('/', (req, res, next) => {
    const username = req.session.username;
    res.render('users/users', { 
        mess: req.flash('mess'), 
        messs: req.flash('messs'),
        logindopuna: req.flash('logindopuna'),
        ponovologin: req.flash('ponovologin'),
        nepostoji: req.flash('nepostoji'),
        username: username
    });
});

pdfMake.vfs = vfsFonts.pdfMake.vfs;

// Get PDF
router.get('/pdf/(:id)', (req, res, next) => {
    const id = req.params.id;

    db.query("SELECT * FROM reklamacije WHERE " + id, function (err, result, fields) {
        if (err) throw err;

        result.forEach(element => {
            const id = element.id;
            const naziv_uredaja = element.nazivuredaja;
            const markauredaja = element.markauredaja;
            const greska = element.greska;
            const donjeo = element.donjeo;
            const broj = element.broj;
            const garancijairacun = element.garancijaracun;
            
            const doucmentDefiniton = {
                content: [
                    {
                        image: 'data:image/png;base64,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',
                        width: '300',
                        margin: [120, 0, 0, 20],
                    },
                    {
                        text: 'Reklamacija / Servis',
                        style: 'reklamacija'
                    },
                    {
                        text: 'Oznaka uređaja:',
                        style: 'naziv'
                    },
                    {
                        ul: [
                            naziv_uredaja
                        ]
                    },
                    {
                        text: 'Marka:',
                        style: 'naziv'
                    },
                    {
                        ul: [
                            markauredaja
                        ]
                    },
                    {
                        text: 'Greška uređaja:',
                        style: 'naziv'
                    },
                    {
                        ul: [
                            greska
                        ]
                    },
                    {
                        text: 'Uređaj dostavio:',
                        style: 'naziv'
                    },
                    {
                        ul: [
                            donjeo
                        ]
                    },
                    {
                        text: 'Broj vlasnika:',
                        style: 'naziv'
                    },
                    {
                        ul: [
                            broj
                        ]
                    },
                    {
                        text: 'Garancija i Račun:',
                        style: 'naziv'
                    },
                    {
                        ul: [
                            garancijairacun
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Potpis Vlasnika:',
                                style: 'potpis'
                            },
                            {
                                text: 'Potpis Primatelja:',
                                style: 'potpis'
                            }
                        ]
                    }
                ],
                styles: {
                    naziv: {
                        fontSize: 15,
                        bold: true,
                        margin: [0, 15, 0, 5]
                    },
                    potpis: {
                        margin: [0, 50, 0, 0]
                    },
                    reklamacija: {
                        fontSize: 20,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 50, 0, 50]
                    }
                }
            }
            
            const pdfDoc = pdfMake.createPdf(doucmentDefiniton);
            pdfDoc.getBase64((data) => {
                res.writeHead(200, 
                {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment;filename="reklamacija.pdf"'
                });
    
                const download = Buffer.from(data.toString('utf-8'), 'base64');
                res.end(download)
            })
        });

    });
});

// Get Profile
router.get('/profile', (req, res, next) => {
    const username = req.session.username;

    db.query("SELECT * FROM reklamacije", function (err, result, fields) {
        if (err) throw err;

        const allreklamacije = result;

        if(result.length > 0){
            let oo = [];
            for (let i = 0; i < allreklamacije.length; i++) {
                const ww = allreklamacije[i];

                let upisano = new Date(ww.vrijeme);
                let sada = new Date();

                let timeDifference = Math.abs(sada.getTime() - upisano.getTime());
                let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

                oo.push(differentDays);
            }

            if(username){
                res.render('users/profile', {
                    username: username,
                    allreklamacije: allreklamacije,
                    oo: oo
                });
            }
            else {
                res.redirect('/users')
            }
        }
        else {

            const differentDays = '';
            const oo = '';
            if(username){
                res.render('users/profile', {
                    username: username,
                    allreklamacije: allreklamacije,
                    differentDays: differentDays,
                    oo: oo
                });
            }
            else {
                res.redirect('/users')
            }
        }
    });
});

// Rijeseno
router.get('/rijeseno', (req, res, next) => {
    const username = req.session.username;

    db.query("SELECT * FROM rijeseno", function (err, result, fields) {
        if (err) throw err;

        const rijes = result;

        if(username){
            res.render('users/rijeseno', {
                username: username,
                rijes: rijes
            });
        }
        else {
            res.redirect('/users');
        }
    });
});

// Rijeseno
router.get('/rijeseno/(:id)', (req, res, next) => {
    const id = req.params.id;

    db.query("INSERT INTO rijeseno SELECT * FROM reklamacije WHERE " + id, function (err, result, fields) {
        if (err) throw err;

        db.query("DELETE FROM reklamacije WHERE " + id, function (err, result, fields) {
            if (err) throw err;
        });

        res.redirect('/users/profile'); 
    });
});

// Login GET
router.get('/create-login', (req, res, next) => {
    res.redirect('/');
});

// Login POST
router.post('/create-login', (req, res, next) => {
    const username_login = req.body.username_login;
    const password_login = req.body.password_login;

    if(username_login && password_login){
        db.query("SELECT password FROM users WHERE username = ?", [username_login], (err, results) => {
            if(err){
                res.send({
                    "code":400,
                    "failed":"error ocurred"
                })
            }

            if(results.length === 0){
                req.flash('nepostoji', 'The user does not exist in the database!');
                res.redirect('/users');
            }
            else {
                const hash = results[0].password.toString();

                bcrypt.compare(password_login, hash, (err, response) => {
                    if(response == true){
                        req.session.loggedin = true;
                        req.session.username = username_login;
                        
                        res.redirect('/users/profile')
                    }
                    else {
                        req.flash('ponovologin', 'Email or password is incorrect!');
                        res.redirect('/users');
                    }
                });
            }

        });
    }
    else {
        req.flash('logindopuna', 'Fill in the fields!');
        res.redirect('/users');
    }

});

// Logout
router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;