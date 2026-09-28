export const responseSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({ statusCode, message, data });
};


