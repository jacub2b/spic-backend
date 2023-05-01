const { MongoClient } = require('mongodb');

async function testMongoConnection(url) {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log('Connected to MongoDB server');
    await client.close();
    console.log('Connection closed');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = testMongoConnection;
