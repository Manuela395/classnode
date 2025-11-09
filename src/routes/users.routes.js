import { Router } from "express";
import {
  registerController,
  getUsersController,
  getUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/users.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

// La ruta de registro es especial, la maneja el admin, pero no queremos protegerla dos veces.
// La protección ya está en el router principal de usuarios.

// Todas las rutas de usuarios requieren un token válido y rol de 'admin'
router.use(verifyToken, checkRole(["admin"]));

router.post("/register", registerController);
router.get("/", getUsersController);
router.get("/:id", getUserController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;