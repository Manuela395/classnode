// src/middleware/auth.middleware.js
import { verify } from "../_helpers/jwt.js";
import { unauthorized } from "../_helpers/response_data.js";

export function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return unauthorized(res, "NO_TOKEN");
    }

    const token = header.split(" ")[1];
    if (!token) return unauthorized(res, "NO_TOKEN");

    const decoded = verify(token);
    req.user = decoded;

    // Si todo está bien, pasa al siguiente middleware
    next();
  } catch (err) {
    return unauthorized(res, "INVALID_TOKEN");
  }
}

// Middleware para verificar JWT
export function requiredAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return unauthorized(res, "NO_TOKEN");
    }

    const token = header.split(" ")[1];
    if (!token) return unauthorized(res, "NO_TOKEN");

    const decoded = verify(token);
    req.user = decoded;

    next();
  } catch (err) {
    return unauthorized(res, "INVALID_TOKEN");
  }
}
