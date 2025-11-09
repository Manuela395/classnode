import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import rolesRoutes from "./roles.routes.js";
import devicesRoutes from "./devices.routes.js";
import appointmentsRoutes from "./appointments.routes.js";
import doctorsPatientsRoutes from "./doctors-patients.routes.js";
import doctorAppointmentsRoutes from "./doctor-appointments.routes.js";
import clinicalsRoutes from "./clinical.routes.js";
import ecgSessionsRoutes from "./ecgSessions.routes.js";
import ecgStreamRoutes from "./ecgStream.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/roles", rolesRoutes);
router.use("/devices", devicesRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/api", doctorsPatientsRoutes);
router.use("/doctor-appointments", doctorAppointmentsRoutes);
router.use("/clinicals", clinicalsRoutes);
router.use("/ecg-sessions", ecgSessionsRoutes);
router.use("/ecgstream", ecgStreamRoutes);



export default router;
