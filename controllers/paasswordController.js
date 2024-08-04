import passwordSchema from "../schemas/passwordSchema.js";
import PasswordService from "../services/PasswordService.js";

class PasswordController {
  static async getPasswords(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const items = await PasswordService.getPasswords(req.body);
      return res.json({ items: items });
    } catch (error) {
      return res.status(403).json({ msg: error.toString() });
    }
  }
  static async createPassword(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const result = passwordSchema.safeParse(req.body);
      if (result.error) return res.status(400).json({ msg: result.error });

      const item = await PasswordService.createPassword(result.data);
      return res.status(201).json("New item added successfully!");
    } catch (error) {
      return res.status(403).json({ msg: error.toString() });
    }
  }

  static async update(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const result = passwordSchema.optional(req.body);
      if (result.error) return res.status(400).json({ msg: result.error });

      const item = await PasswordService.createPassword(result.data);
      return res.json({ msg: "Item successfully updated" });
    } catch (error) {
      return res.status(403).json({ msg: error.toString() });
    }
  }

  static async delete(req, res, next) {
    if (!req.rawHeaders.includes("content-type"))
      return res.status(400).json({ msg: "Make sure to set the Content-Type" });

    try {
      const items = await PasswordService.delete(req.body);
      return res.json({ msg: "Item successfully deleted" });
    } catch (error) {
      return res.status(403).json({ msg: error.toString() });
    }
  }
}

export default PasswordController;
