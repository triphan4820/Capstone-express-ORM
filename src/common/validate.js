import { BadRequest } from "./app-error.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidInteger = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

export const isEmail = (value) => typeof value === "string" && EMAIL_REGEX.test(value);

export const requireString = (value, fieldName) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw BadRequest(`${fieldName} is required`);
  }
  return value.trim();
};

export const parseId = (value, fieldName = "id") => {
  const id = Number(value);
  if (!isValidInteger(id, 1, Number.MAX_SAFE_INTEGER)) {
    throw BadRequest(`${fieldName} must be a positive integer`);
  }
  return id;
};

export const parseAge = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const age = Number(value);
  if (!isValidInteger(age, 1, 120)) {
    throw BadRequest("Age must be an integer between 1 and 120");
  }
  return age;
};

export const parsePagination = (query) => {
  const page = Number(query.page ?? 1);
  const pageSize = Number(query.pageSize ?? 20);

  if (!isValidInteger(page, 1, Number.MAX_SAFE_INTEGER)) {
    throw BadRequest("page must be an integer greater than or equal to 1");
  }
  if (!isValidInteger(pageSize, 1, 100)) {
    throw BadRequest("pageSize must be an integer between 1 and 100");
  }

  return { page, pageSize, offset: (page - 1) * pageSize };
};


