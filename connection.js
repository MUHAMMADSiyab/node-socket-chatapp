var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'your database name'
});

connection.connect(function(err){
  if (!err) {
    // Do something here
  } else {
    console.log('Database not connected. ' + err);
  }
});

module.exports = connection;
