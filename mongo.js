const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
let cachedDb = null;

async function connectToDB() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('spic');
  cachedDb = db;
  return db;
}

module.exports = connectToDB;
