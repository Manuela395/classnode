import { Router } from "express";
import {
  listAppointments,
  getAppointment,
  createAppointmentController,
  updateAppointmentController,
  deleteAppointmentController,
} from "../controllers/appointments.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

// Todas las rutas de citas requieren un token válido y rol de 'admin_aux'
router.use(verifyToken, checkRole(["admin_aux"]));

router.get("/", listAppointments);
router.get("/:id", getAppointment);
router.post("/register", createAppointmentController);
router.put("/:id", updateAppointmentController);
router.delete("/:id", deleteAppointmentController);

export default router;
