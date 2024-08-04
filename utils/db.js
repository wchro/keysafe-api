import { MongoClient } from "mongodb";

class Database {
  #host;
  #client;
  #db;

  constructor() {
    this.#host = process.env.MONGO_URI;
    this.#client = new MongoClient(this.#host, {
      connectTimeoutMS: 10000,
    });
  }

  async connect() {
    try {
      await this.#client.connect();
      this.#db = this.#client.db(process.env.MONGO_DB);
      console.log("INFO: Sucessfully connected to MongoDB");
    } catch (err) {
      console.log("ERROR: Error establishing a connection to MongoDB");
      process.exit(1);
    }
  }

  async getDB() {
    if (!this.#db) throw new Error("Database not initialized");
    return this.#db;
  }

  async close() {
    this.#client.close();
  }
}

export default new Database();
