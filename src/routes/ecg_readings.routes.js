import { Router } from "express";
import { insertReading, listReadings, getReading } from "../controllers/ecg_readings.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

router.use(verifyToken, checkRole(["doc"]));
router.get("/", listReadings);
router.get("/:id", getReading);
router.post("/", insertReading);

export default router;

