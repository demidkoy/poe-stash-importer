const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let db = {};

db.connect = () => {
  return new Promise((resolve, reject) => {
    const user = encodeURIComponent('yuriy');
    const password = encodeURIComponent('Cookies4!');
    const authMechanism = 'DEFAULT';
    
    const url = `mongodb://${user}:${password}@localhost:27017/?authMechanism=${authMechanism}`;
    
    const client = new MongoClient(url);
    client.connect(async(err) => {
      assert.equal(null, err);
      const db = client.db('poe_test');
      resolve(db);
    });
  });
}

module.exports = db;