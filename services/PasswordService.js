import jwt from "jsonwebtoken";
import { Password } from "../models/Password.js";

class PasswordService {
  static async getPasswords(accessToken) {
    const isTokenValid = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!isTokenValid) throw new Error("Invalid access token!");

    const { user_id } = jwt.decode(accessToken);

    const items = await Password.getAll(user_id);
    return items;
  }
  static async createPassword({ name, account, password, site, accessToken }) {
    const isTokenValid = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!isTokenValid) throw new Error("Invalid access token!");

    const { user_id } = jwt.decode(accessToken);

    const item = await Password.create(name, account, password, site, user_id);
    return item;
  }

  static async update({ item_id, name, account, password, site, accessToken }) {
    const isTokenValid = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!isTokenValid) throw new Error("Invalid access token!");

    const { user_id } = jwt.decode(accessToken);

    const items = await Password.update(
      item_id,
      name,
      account,
      password,
      site,
      user_id
    );
    return items;
  }

  static async delete({ item_id, accessToken }) {
    const isTokenValid = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!isTokenValid) throw new Error("Invalid access token!");

    const { user_id } = jwt.decode(accessToken);

    const items = await Password.delete(item_id, user_id);
    return items;
  }
}

export default PasswordService;
