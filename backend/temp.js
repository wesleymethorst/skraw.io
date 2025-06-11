const fs = require('fs');
const db = require('./db'); // Adjust if your db.js exports a pool or client

const sql = fs.readFileSync('temp.sql', 'utf8');

db.query(sql)
  .then(res => {
    console.log('Query executed:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error executing query:', err);
    process.exit(1);
  });