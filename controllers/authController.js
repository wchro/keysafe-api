import userSchema from "../schemas/userSchema.js";
import AuthService from "../services/AuthService.js";

class AuthController {
  static async register(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const result = userSchema.safeParse(req.body);
      if (result.error) return res.status(400).json({ msg: result.error });

      const user = await AuthService.register(result.data);
      return res
        .status(201)
        .json({ msg: "Account has been successfully created!" });
    } catch (error) {
      return res.status(409).json({ msg: error.toString() });
    }
  }

  static async login(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const user = await AuthService.login(req.body);
      return res.json({ token: user });
    } catch (error) {
      return res.status(409).json({ msg: error.toString() });
    }
  }

  static async refreshToken(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const token = await AuthService.refreshToken(req.body);
      return res.status(200).json({ token: token });
    } catch (error) {
      return res.status(403).json({ msg: error.toString() });
    }
  }
}

export default AuthController;
