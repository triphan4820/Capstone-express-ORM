import { Op } from "sequelize";
import { Image, User, Comment, SavedImage } from "../models/index.js";
import { BadRequest, Conflict, Forbidden, NotFound } from "../common/app-error.js";
import { parsePagination, requireString } from "../common/validate.js";

const PUBLIC_USER_ATTRIBUTES = ["user_id", "full_name", "avatar"];
const includeCreator = { model: User, as: "creator", attributes: PUBLIC_USER_ATTRIBUTES };

const normalizeOptionalText = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const buildPaginationResult = ({ page, pageSize }, totalItems, items) => ({
  page,
  pageSize,
  totalItems,
  totalPages: Math.ceil(totalItems / pageSize),
  items,
});

const findImageOrThrow = async (imageId) => {
  const image = await Image.findByPk(imageId);
  if (!image) throw NotFound("Image not found");
  return image;
};

const paginateImages = async (where, query) => {
  const { page, pageSize, offset } = parsePagination(query);
  const { count, rows } = await Image.findAndCountAll({
    where,
    include: [includeCreator],
    order: [["image_id", "DESC"]],
    limit: pageSize,
    offset,
  });

  return buildPaginationResult({ page, pageSize }, count, rows);
};

const imageService = {
  getImages: async (query) => paginateImages({}, query),

  searchImages: async (query) => {
    const keyword = requireString(query.name, "Search keyword (name)");
    return paginateImages({ image_name: { [Op.like]: `%${keyword}%` } }, query);
  },

  getImageDetail: async (imageId) => {
    const image = await Image.findByPk(imageId, { include: [includeCreator] });
    if (!image) throw NotFound("Image not found");
    return image;
  },

  getComments: async (imageId) => {
    await findImageOrThrow(imageId);
    return Comment.findAll({
      where: { image_id: imageId },
      include: [{ model: User, as: "commenter", attributes: PUBLIC_USER_ATTRIBUTES }],
      order: [["comment_date", "DESC"]],
    });
  },

  addComment: async (imageId, userId, body) => {
    await findImageOrThrow(imageId);
    const rawContent = body.content ?? body.noi_dung;
    const content = requireString(rawContent, "Comment content (content)");
    if (content.length > 1000) throw BadRequest("Comment must be at most 1000 characters");

    const comment = await Comment.create({
      image_id: imageId,
      user_id: userId,
      content,
      comment_date: new Date(),
    });

    return Comment.findByPk(comment.comment_id, {
      include: [{ model: User, as: "commenter", attributes: PUBLIC_USER_ATTRIBUTES }],
    });
  },

  checkSaved: async (imageId, userId) => {
    await findImageOrThrow(imageId);
    const saved = await SavedImage.findOne({ where: { image_id: imageId, user_id: userId } });
    return { image_id: imageId, is_saved: !!saved, saved_date: saved ? saved.saved_date : null };
  },

  createImage: async (userId, body, fileUrl) => {
    if (!fileUrl) throw BadRequest("Please upload an image file (field \"image\" or \"hinh_anh\")");

    const title = requireString(body.image_name ?? body.ten_hinh, "Image title (image_name)");
    if (title.length > 255) throw BadRequest("Image title must be at most 255 characters");

    const description = normalizeOptionalText(body.description ?? body.mo_ta);
    if (description && description.length > 1000) throw BadRequest("Description must be at most 1000 characters");

    const image = await Image.create({
      image_name: title,
      image_url: fileUrl,
      description,
      user_id: userId,
    });

    return Image.findByPk(image.image_id, { include: [includeCreator] });
  },

  deleteImage: async (imageId, userId) => {
    const image = await findImageOrThrow(imageId);
    if (image.user_id !== userId) throw Forbidden("You can only delete images created by yourself");
    await image.destroy();
    return image;
  },

  saveImage: async (imageId, userId) => {
    await findImageOrThrow(imageId);
    const existed = await SavedImage.findOne({ where: { image_id: imageId, user_id: userId } });
    if (existed) throw Conflict("You have already saved this image");
    return SavedImage.create({ image_id: imageId, user_id: userId, saved_date: new Date() });
  },

  unsaveImage: async (imageId, userId) => {
    await findImageOrThrow(imageId);
    const deleted = await SavedImage.destroy({ where: { image_id: imageId, user_id: userId } });
    if (!deleted) throw NotFound("You have not saved this image yet");
    return { image_id: imageId, is_saved: false };
  },
};

export default imageService;



