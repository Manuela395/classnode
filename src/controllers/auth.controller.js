import {
  badReq,
  ok,
  unauthorized,
  serverErr,
} from "../_helpers/response_data.js";
import { loginSchema } from "../_helpers/validators.js";
import { loginService } from "../services/auth.service.js";

export async function loginController(req, res) {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return badReq(res, "VALIDATION", error.details);
    const data = await loginService(value);
    return ok(res, data);
  } catch (e) {
    if (e.message === "INVALID_CREDENTIALS") {
      return unauthorized(res, "INVALID_CREDENTIALS");
    }
    return serverErr(res, e);
  }
}

export async function logoutController(req, res) {
  return ok(res, { message: "Logout ok" });
}