import jwt from "jsonwebtoken";
export const sign = (payload) =>  // las peticiones, los servicios
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "1h" });
export const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);