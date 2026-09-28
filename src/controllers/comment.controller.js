import commentService from "../services/comment.service.js";
import { responseSuccess } from "../common/response.js";
import { parseId } from "../common/validate.js";

const commentController = {
  deleteComment: async (req, res) => {
    const commentId = parseId(req.params.id, "comment_id");
    const data = await commentService.deleteComment(commentId, req.user.user_id);
    return responseSuccess(res, data, "Comment deleted successfully");
  },
};

export default commentController;
