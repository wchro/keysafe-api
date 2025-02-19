import UserService from "../services/UserService.js";

class UserController {
  static async getInfo(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const token = req.headers.authorization.split(" ")[1];
      const info = await UserService.getInfo(token);
      return res.json({ success: true, ...info });
    } catch (error) {
      return res.status(403).json({ success: false, msg: error.toString() });
    }
  }
}

export default UserController;
