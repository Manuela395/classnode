import { Router } from "express";
import { getAllAppointments } from "../services/appointments.service.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

// Rutas para doctores - accesibles por doc
router.use(verifyToken, checkRole(["doc"]));

router.get("/", async (req, res) => {
  try {
    const appointments = await getAllAppointments();
    return res.json({ ok: true, appointments });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
