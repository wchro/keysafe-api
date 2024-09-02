import { ObjectId } from "mongodb";
import Database from "../utils/db.js";
import bcrypt, { hash } from "bcrypt";

export class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = new Date().valueOf();
  }

  static async create({ username, email, password }) {
    const usernameExists = await this.findByUsername(username);
    const emailExists = await this.findByEmail(email);

    if (usernameExists) throw new Error("Username already exists");
    if (emailExists) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(username, email, hashedPassword);

    const db = await Database.getDB();
    const result = await db
      .collection("users")
      .insertOne(user, (error, response) => response.ops[0]);

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
    return bcrypt.compare(password, this.password);
  }
}
