import { Router } from "express";
import { insertReading, listReadings } from "../controllers/ecg_readings.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

router.use(verifyToken, checkRole(["doc"]));
router.get("/", listReadings);
router.post("/", insertReading);

export default router;

