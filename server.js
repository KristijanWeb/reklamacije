const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path')
const session = require('express-session');
const flush = require('connect-flash');

const indexRoute = require('./routes/index');
const userRoute = require('./routes/users');
const reklamRoute = require('./routes/reklamacije.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(flush());

app.set('port', (process.env.PORT || 5000))

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'))

// Route
app.use('/', indexRoute);
app.use('/users', userRoute);
app.use('/reklam', reklamRoute);

app.listen(app.get('port'), () => {
  console.log(`listening on port http://localhost:${app.get('port')}/`)
})