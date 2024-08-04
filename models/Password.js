import { ObjectId } from "mongodb";
import Database from "../utils/db.js";

export class Password {
  constructor(name, account, password, site, user_id) {
    this.name = name;
    this.account = btoa(account);
    this.password = btoa(password);
    this.site = site;
    this.createdAt = new Date().valueOf();
    this.updatedAt = new Date().valueOf();
    this.owner = user_id;
  }

  static async getAll(user_id) {
    const db = await Database.getDB();
    const items = await db
      .collection("items")
      .find({ owner: user_id })
      .toArray();

    return items;
  }

  static async create(name, account, password, site, user_id) {
    const item = new Password(name, account, password, site, user_id);

    const db = await Database.getDB();
    const result = await db.collection("items").insertOne(item);

    return result;
  }

  static async update(item_id, name, account, password, site, user_id) {
    const updatedAt = new Date().valueOf();
    const db = await Database.getDB();
    const result = await db.collection("items").updateOne(
      { _id: new ObjectId(item_id), owner: user_id },
      {
        $set: {
          name,
          account,
          password,
          site,
          updatedAt,
        },
      }
    );

    return result;
  }

  static async delete(item_id, user_id) {
    const db = await Database.getDB();
    const item = await db
      .collection("items")
      .deleteOne({ _id: new ObjectId(item_id), owner: user_id });

    return item;
  }
}
