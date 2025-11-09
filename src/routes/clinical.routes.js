import { Router } from "express";
import {
  createClinicalController,
  getAllClinicalsController,
  getClinicalByIdController,
  updateClinicalController,
  deleteClinicalController,
} from "../controllers/clinical.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

// Todas las rutas de registros clínicos requieren un token válido y rol de 'doc'
router.use(verifyToken, checkRole(["doc"]));

router.post("/register", createClinicalController);
router.get("/", getAllClinicalsController);
router.get("/:id", getClinicalByIdController);
router.put("/:id", updateClinicalController);
router.delete("/:id", deleteClinicalController);

export default router;
