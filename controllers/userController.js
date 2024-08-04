import UserService from "../services/UserService.js";

class UserController {
  static async getInfo(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const info = await UserService.getInfo(req.body);
      return res.json(info);
    } catch (error) {
      return res.status(403).json({ msg: error.toString() });
    }
  }
}

export default UserController;
