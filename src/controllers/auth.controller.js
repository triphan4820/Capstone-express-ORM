import authService from "../services/auth.service.js";
import { responseSuccess } from "../common/response.js";

const authController = {
  register: async (req, res) => {
    const user = await authService.register(req.body ?? {});
    return responseSuccess(res, user, "Registration successful", 201);
  },

  login: async (req, res) => {
    const result = await authService.login(req.body ?? {});
    return responseSuccess(res, result, "Login successful");
  },
};


export default authController;

