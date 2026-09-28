import imageService from "../services/image.service.js";
import { responseSuccess } from "../common/response.js";
import { parseId } from "../common/validate.js";
import { buildFileUrl, removeUploadedFile } from "../common/file.js";

const resolveImageId = (req) => parseId(req.params.id, "image_id");

const imageController = {
  getImages: async (req, res) => {
    const data = await imageService.getImages(req.query);
    return responseSuccess(res, data, "Get images successful");
  },

  searchImages: async (req, res) => {
    const data = await imageService.searchImages(req.query);
    return responseSuccess(res, data, "Search images successful");
  },

  getImageDetail: async (req, res) => {
    const data = await imageService.getImageDetail(resolveImageId(req));
    return responseSuccess(res, data, "Get image detail successful");
  },

  getComments: async (req, res) => {
    const data = await imageService.getComments(resolveImageId(req));
    return responseSuccess(res, data, "Get comments successful");
  },

  addComment: async (req, res) => {
    const imageId = resolveImageId(req);
    const data = await imageService.addComment(imageId, req.user.user_id, req.body ?? {});
    return responseSuccess(res, data, "Comment created successfully", 201);
  },

  checkSaved: async (req, res) => {
    const imageId = resolveImageId(req);
    const data = await imageService.checkSaved(imageId, req.user.user_id);
    return responseSuccess(res, data, data.is_saved ? "Image is saved" : "Image is not saved");
  },

  createImage: async (req, res) => {
    const fileUrl = req.file ? buildFileUrl(req, req.file.filename) : null;
    try {
      const data = await imageService.createImage(req.user.user_id, req.body ?? {}, fileUrl);
      return responseSuccess(res, data, "Image created successfully", 201);
    } catch (err) {
      if (req.file) await removeUploadedFile(`/uploads/${req.file.filename}`);
      throw err;
    }
  },

  deleteImage: async (req, res) => {
    const imageId = resolveImageId(req);
    const image = await imageService.deleteImage(imageId, req.user.user_id);
    await removeUploadedFile(image.image_url);
    return responseSuccess(res, { image_id: image.image_id }, "Image deleted successfully");
  },

  saveImage: async (req, res) => {
    const imageId = resolveImageId(req);
    const data = await imageService.saveImage(imageId, req.user.user_id);
    return responseSuccess(res, data, "Image saved successfully", 201);
  },

  unsaveImage: async (req, res) => {
    const imageId = resolveImageId(req);
    const data = await imageService.unsaveImage(imageId, req.user.user_id);
    return responseSuccess(res, data, "Image unsaved successfully");
  },
};


export default imageController;

