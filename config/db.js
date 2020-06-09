// var mysql = require('mysql');

// var conn = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '', 
//   database: 'kozulreklamacije' 
// });

// conn.connect(function(err) {
//   if (err) throw err;
//   console.log('Database is connected successfully !');
// });

// module.exports = conn;


const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'kristij2_reklamacijeuser',
  password: 'Reklamacije;;', 
  database: 'kristij2_reklamacije' 
});

conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});

module.exports = conn;