import userSchema from "../schemas/userSchema.js";
import AuthService from "../services/AuthService.js";

class AuthController {
  static async register(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res
        .status(400)
        .json({ success: false, msg: "Make sure to set the Content-Type" });

    try {
      const result = userSchema.safeParse(req.body);
      if (result.error)
        return res.status(400).json({ success: false, msg: result.error });

      const user = await AuthService.register(result.data);
      return res.status(201).json({
        success: true,
        msg: "Account has been successfully created!",
        ...user,
      });
    } catch (error) {
      return res.status(409).json({ success: false, msg: error.toString() });
    }
  }

  static async login(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const user = await AuthService.login(req.body);
      return res.json({ success: true, ...user });
    } catch (error) {
      return res.status(409).json({ success: false, msg: error.toString() });
    }
  }

  static async refreshToken(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res
        .status(400)
        .json({ success: false, msg: "Make sure to set the Content-Type" });

    try {
      const token = await AuthService.refreshToken(
        req.headers.authorization.split(" ")[1]
      );
      return res.status(200).json({ success: true, token: token });
    } catch (error) {
      const oldToken = req.headers.authorization.split(" ")[1];
      return res
        .status(403)
        .json({ success: false, msg: error.toString(), oldToken });
    }
  }
}

export default AuthController;
