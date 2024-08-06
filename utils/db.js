const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'site_ranker';
const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect()
      .then((client) => {
        this.db = client.db(database);
        this.userCollection = this.db.collection('users');
        this.siteCollection = this.db.collection('sites');
        this.voteCollection = this.db.collection('votes');
        this.categoryCollection = this.db.collection('categories');
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    if (!this.isAlive()) {
      return 0;
    }
    return this.userCollection.countDocuments({});
  }

  async nbSites() {
    if (!this.isAlive()) {
      return 0;
    }
    return this.siteCollection.countDocuments({});
  }

  async nbVotes() {
    if (!this.isAlive()) {
      return 0;
    }
    return this.voteCollection.countDocuments({});
  }

  async nbCategories() {
    if (!this.isAlive()) {
      return 0;
    }
    return this.categoryCollection.countDocuments({});
  }
}

const dbClient = new DBClient();
export default dbClient;
