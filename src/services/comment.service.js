import { Comment, Image } from "../models/index.js";
import { Forbidden, NotFound } from "../common/app-error.js";

const commentService = {
  deleteComment: async (commentId, userId) => {
    const comment = await Comment.findByPk(commentId, {
      include: [{ model: Image, as: "image" }],
    });
    if (!comment) throw NotFound("Comment not found");

    const isCommentOwner = comment.user_id === userId;
    const isImageOwner = comment.image && comment.image.user_id === userId;
    if (!isCommentOwner && !isImageOwner) {
      throw Forbidden("You do not have permission to delete this comment");
    }

    await comment.destroy();
    return { comment_id: commentId };
  },
};

export default commentService;
