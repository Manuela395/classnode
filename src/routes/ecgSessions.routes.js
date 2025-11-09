import { Router } from "express";
import {
  createECGSessionController,
  getAllECGSessionsController,
  getECGSessionByIdController,
  updateECGSessionController,
  deleteECGSessionController,
  getEligiblePatientsController,
} from "../controllers/ecgSessions.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

// Todas las rutas de sesiones ECG requieren un token válido y rol de 'doc'
router.use(verifyToken, checkRole(["doc"]));

router.post("/", createECGSessionController);
router.get("/eligible-patients", getEligiblePatientsController);
router.get("/", getAllECGSessionsController);
router.get("/:id", getECGSessionByIdController);
router.put("/:id", updateECGSessionController);
router.delete("/:id", deleteECGSessionController);

export default router;
