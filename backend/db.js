const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'qqgbMvOxfvyjAoLdOIjkcopNqpNBZamR',
  database: 'railway',
});

module.exports = pool;
