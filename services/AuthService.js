import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

class AuthService {
  static async register(data) {
    const user = await User.create(data);
    const accessToken = this.#generateTokens(user.insertedId, "access");
    const refreshToken = this.#generateTokens(user.insertedId, "refresh");

    return { user: user.insertedId, accessToken, refreshToken };
  }

  static async login({ username, password }) {
    const user = await User.findByUsername(username);
    if (!user) throw new Error("User not found");

    const userAccount = new User(user.username, user.email, user.password);
    const isPasswordCorrect = await userAccount.checkPassword(password);

    if (!isPasswordCorrect) throw new Error("Password invalid!");

    const accessToken = this.#generateTokens(user._id, "access");

    const refreshToken = this.#generateTokens(user._id, "refresh");

    return { user: user._id, accessToken, refreshToken };
  }

  static async refreshToken({ currToken }) {
    const isCurrentTokenValid = jwt.verify(
      currToken,
      process.env.JWT_ACCESS_SECRET
    );
    if (!isCurrentTokenValid) throw new Error("Token is invalid!");

    const currentToken = jwt.decode(currToken);
    const token = this.#generateTokens(currentToken.user_id, "access");

    return token;
  }

  static #generateTokens(user_id, type) {
    switch (type) {
      case "access":
        return jwt.sign({ user_id: user_id }, process.env.JWT_ACCESS_SECRET, {
          expiresIn: "1d",
        });
      case "refresh":
        return jwt.sign({ user_id: user_id }, process.env.JWT_REFRESH_SECRET, {
          expiresIn: "1m",
        });
    }
  }
}

export default AuthService;
