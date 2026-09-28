import userService from "../services/user.service.js";
import { responseSuccess } from "../common/response.js";
import { parseId } from "../common/validate.js";
import { buildFileUrl, removeUploadedFile } from "../common/file.js";

const resolveUserId = (req) =>
  req.params.id === "me" ? req.user.user_id : parseId(req.params.id, "user_id");

const userController = {
  getMe: async (req, res) => {
    return responseSuccess(res, req.user, "Get profile successful");
  },

  getSavedImages: async (req, res) => {
    const data = await userService.getSavedImages(resolveUserId(req), req.query);
    return responseSuccess(res, data, "Get saved images successful");
  },

  getCreatedImages: async (req, res) => {
    const data = await userService.getCreatedImages(resolveUserId(req), req.query);
    return responseSuccess(res, data, "Get created images successful");
  },

  updateMe: async (req, res) => {
    const avatarUrl = req.file ? buildFileUrl(req, req.file.filename) : null;
    const oldAvatar = req.user.avatar;

    try {
      const user = await userService.updateMe(req.user.user_id, req.body ?? {}, avatarUrl);
      if (oldAvatar !== user.avatar) await removeUploadedFile(oldAvatar);
      return responseSuccess(res, user, "Update profile successful");
    } catch (err) {
      if (req.file) await removeUploadedFile(`/uploads/${req.file.filename}`);
      throw err;
    }
  },
};


export default userController;


