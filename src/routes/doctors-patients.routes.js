import { Router } from "express";
import { getAllUsers } from "../services/users.service.js";
import { getAllAppointments } from "../services/appointments.service.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

// Rutas para obtener doctores y pacientes - accesibles por admin_aux
router.use(verifyToken, checkRole(["admin", "admin_aux"]));

router.get("/doctors", async (req, res) => {
  try {
    const users = await getAllUsers();
    const doctors = users.filter(user => user.role?.code === 'doc');
    return res.json({ ok: true, doctors });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/patients", async (req, res) => {
  try {
    const users = await getAllUsers();
    const patients = users.filter(user => user.role?.code === 'pac');
    return res.json({ ok: true, patients });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Rutas para doctores - accesibles por doc
router.get("/doctor-appointments", async (req, res) => {
  try {
    const appointments = await getAllAppointments();
    return res.json({ ok: true, appointments });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
