import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

class UserService {
  static async getInfo({ accessToken }) {
    const isTokenValid = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!isTokenValid) throw new Error("User not authenticated");

    const token = jwt.decode(accessToken);
    const accountData = await User.findById(token.user_id);

    if (!accountData) throw new Error("User does not exist");
    const { _id, username, email, createdAt } = accountData;

    const account = {
      id: _id,
      username,
      email,
      createdAt,
    };

    return account;
  }
}

export default UserService;
