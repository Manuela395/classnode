import { Router } from "express";
import {
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";
import { registerController } from "../controllers/users.controller.js";
import { requiredAuth } from "../middleware/auth.middleware.js";

const r = Router();

r.get("/test", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});
r.post("/register", registerController);
r.post("/login", loginController);
r.post("/logout", logoutController);

r.get("/userAuth", requiredAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default r;
