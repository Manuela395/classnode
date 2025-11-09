import { forbidden } from "../_helpers/response_data.js";

export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return forbidden(res, "ACCESS_DENIED");
    }
    next();
  };
};