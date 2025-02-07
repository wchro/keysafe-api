import { ObjectId } from "mongodb";
import Database from "../utils/db.js";

export class User {
  constructor(username, email, password, salt, masterKey) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.salt = salt;
    this.masterKey = masterKey;
    this.createdAt = new Date().valueOf();
  }

  static async create({ username, email, password, salt, masterKey }) {
    const usernameExists = await this.findByUsername(username);
    const emailExists = await this.findByEmail(email);

    if (usernameExists) throw new Error("Username already exists");
    if (emailExists) throw new Error("Email already exists");

    const user = new User(username, email, password, salt, masterKey);

    const db = await Database.getDB();
    const result = await db.collection("users").insertOne(user);

    return result;
  }

  static async findByUsername(username) {
    const db = await Database.getDB();
    const data = await db.collection("users").findOne({ username });

    return data;
  }

  static async findByEmail(email) {
    const db = await Database.getDB();
    const data = await db.collection("users").findOne({ email });

    return data;
  }

  static async findById(id) {
    const db = await Database.getDB();
    const data = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    return data;
  }

  async checkPassword(password) {
    return password === this.password;
  }

  static async isValidArgon2Hash(hash) {
    const argon2Regex =
      /^\$argon2(id|i|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+={0,2}\$[A-Za-z0-9+/]+={0,2}$/;
    return argon2Regex.test(hash);
  }
}
