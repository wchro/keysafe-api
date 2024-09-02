import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

class AuthService {
  static async register(data) {
    const user = await User.create(data);
    return user;
  }

  static async login({ username, password }) {
    const user = await User.findByUsername(username);
    if (!user) throw new Error("User not found");

    const userAccount = new User(user.username, user.email, user.password);
    const isPasswordCorrect = await userAccount.checkPassword(password);

    if (!isPasswordCorrect) throw new Error("Password invalid!");

    const accessToken = jwt.sign(
      { user_id: user._id },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { user_id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1m",
      }
    );

    return { username: userAccount.username, accessToken, refreshToken };
  }

  static async refreshToken({ currToken }) {
    const isCurrentTokenValid = jwt.verify(currToken, process.env.JWT_SECRET);
    if (!isCurrentTokenValid) throw new Error("Token is invalid!");

    const currentToken = jwt.decode(currToken);
    console.log(currentToken);
    const token = jwt.sign(
      { user_id: currentToken.user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return token;
  }
}

export default AuthService;
