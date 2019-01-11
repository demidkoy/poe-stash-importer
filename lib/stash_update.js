const axios = require('axios');
const conn = require('./db');
let importer = {};

const insertDocuments = async (db, stashes, callback) => {
  return new Promise((resolve, reject) => {
    const collection = db.collection(process.env.COLLECTION);

    const bulk = collection.initializeUnorderedBulkOp();
    stashes.map(s => {
      bulk.find( { _id : s._id } ).upsert().update( { $set: { public: s.public, account_name: s.accountName, last_character_name: s.lastCharacterName, stash: s.stash, stash_type: s.stashType, league: s.league, items: s.items, items_length: s.items.length, update_ts: new Date() } });
    });
    bulk.execute(() => {
      resolve();
    });
  }).catch(e => console.log(e));
}

const nextStash = (nextChangeId) => {
  return new Promise(async (resolve, reject) => {
    const result = await axios.get(`http://www.pathofexile.com/api/public-stash-tabs?id=${nextChangeId}`);
    resolve(result.data);
  }).catch(e => console.log(e));
}

importer.getData = async () => {
  const db = await conn.connect();
  let stashes = [];
  let nextChangeId = process.env.START_ID;
  let data = await nextStash(nextChangeId);
  nextChangeId = data.next_change_id;
  await insertDocuments(db, data.stashes);
  setInterval(async () => {
    stashes = [];
    data = await nextStash(nextChangeId);
    await insertDocuments(db, data.stashes);
    nextChangeId = data.next_change_id;
  }, 5000)
}

module.exports = importer;