
1
2
3
4
5
const monk = require('monk');
const connectionString = process.env.MONGODB_URI || 'localhost/cooperativa';
const db = monk(connectionString);

module.exports = db;
