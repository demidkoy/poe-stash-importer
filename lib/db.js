const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let db = {};

db.connect = () => {
  return new Promise((resolve, reject) => {
    const user = encodeURIComponent(process.env.DB_USER);
    const password = encodeURIComponent(process.env.DB_PASS);
    const authMechanism = 'DEFAULT';
    
    const url = `mongodb://${user}:${password}@${process.env.DB_HOST}:${process.env.DB_PORT}/?authMechanism=${authMechanism}`;
    
    const client = new MongoClient(url);
    client.connect(async(err) => {
      assert.equal(null, err);
      const db = client.db('poe_test');
      resolve(db);
    });
  });
}

module.exports = db;