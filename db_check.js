const Database = require('better-sqlite3');
const db = new Database('outside.db');

const adventures = db.prepare('SELECT * FROM adventures').all();
console.log('Adventures:', adventures);

const missions = db.prepare('SELECT * FROM missions').all();
console.log('Missions:', missions);
