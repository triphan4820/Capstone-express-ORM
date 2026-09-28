import { User, Image, SavedImage } from "../models/index.js";
import { BadRequest, NotFound } from "../common/app-error.js";
import { parseAge, parsePagination } from "../common/validate.js";

const includeCreator = { model: User, as: "creator", attributes: ["user_id", "full_name", "avatar"] };

const ensureUserExists = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw NotFound("User not found");
  return user;
};

const buildPaginationResult = ({ page, pageSize }, totalItems, items) => ({
  page,
  pageSize,
  totalItems,
  totalPages: Math.ceil(totalItems / pageSize),
  items,
});

const userService = {
  getSavedImages: async (userId, query) => {
    await ensureUserExists(userId);
    const paging = parsePagination(query);
    const { count, rows } = await SavedImage.findAndCountAll({
      where: { user_id: userId },
      include: [{ model: Image, as: "image", include: [includeCreator] }],
      order: [["saved_date", "DESC"]],
      limit: paging.pageSize,
      offset: paging.offset,
    });

    const items = rows.map((row) => ({ ...row.image.toJSON(), saved_date: row.saved_date }));
    return buildPaginationResult(paging, count, items);
  },

  getCreatedImages: async (userId, query) => {
    await ensureUserExists(userId);
    const paging = parsePagination(query);
    const { count, rows } = await Image.findAndCountAll({
      where: { user_id: userId },
      include: [includeCreator],
      order: [["image_id", "DESC"]],
      limit: paging.pageSize,
      offset: paging.offset,
    });

    return buildPaginationResult(paging, count, rows);
  },

  updateMe: async (userId, body, avatarUrl) => {
    const changes = {};
    const fullNameRaw = body.full_name ?? body.ho_ten;
    const ageRaw = body.age ?? body.tuoi;
    const avatarRaw = body.avatar ?? body.anh_dai_dien;

    if (fullNameRaw !== undefined) {
      if (typeof fullNameRaw !== "string" || fullNameRaw.trim() === "") {
        throw BadRequest("Full name cannot be empty");
      }
      changes.full_name = fullNameRaw.trim();
    }

    if (ageRaw !== undefined) {
      changes.age = parseAge(ageRaw);
    }

    if (avatarUrl) {
      changes.avatar = avatarUrl;
    } else if (avatarRaw !== undefined) {
      if (typeof avatarRaw !== "string") {
        throw BadRequest("Avatar must be a valid path (string)");
      }
      changes.avatar = avatarRaw.trim() || null;
    }

    if (Object.keys(changes).length === 0) {
      throw BadRequest("No valid fields provided for update (full_name, age, avatar)");
    }

    await User.update(changes, { where: { user_id: userId } });
    return User.findByPk(userId);
  },
};


export default userService;


