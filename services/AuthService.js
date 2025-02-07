import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { generateHex } from "../utils/generateHex.js";

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

    const userAccount = new User(
      user.username,
      user.email,
      user.password,
      user.salt,
      user.masterKey
    );
    const isPasswordCorrect = await userAccount.checkPassword(password);

    if (!isPasswordCorrect) throw new Error("Password invalid!");

    const accessToken = this.#generateTokens(user._id, "access");
    const refreshToken = this.#generateTokens(user._id, "refresh");

    const masterKey = user.masterKey;

    return { user: user._id, accessToken, refreshToken, masterKey };
  }

  static async prelogin({ username }) {
    const user = await User.findByUsername(username);
    // happy hacking - return a random salt if the user doesn't exist
    return {
      salt: user.salt ?? generateHex(crypto.getRandomValues(new uInt8Array())),
    };
  }

  static async refreshToken(currToken) {
    const isCurrentTokenValid = jwt.verify(
      currToken,
      process.env.JWT_REFRESH_SECRET
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

  static async isValidArgon2Hash(hash) {
    const argon2Regex =
      /^\$argon2(id|i|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+={0,2}\$[A-Za-z0-9+/]+={0,2}$/;
    return argon2Regex.test(hash);
  }
}

export default AuthService;
